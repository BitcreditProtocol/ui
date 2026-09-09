#!/usr/bin/env python3
"""Native package-format checks plus registry simulations; no publication credentials."""

import copy
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import package_release as release


class Terminated(RuntimeError):
    pass


class Remote:
    def __init__(self, folder, ctx):
        self.ctx = ctx
        self.plan = json.loads((folder / release.PLAN).read_text())
        self.values = {target: None for target in release.TARGETS}
        self.writes = []
        self.reads = []
        self.stop = None
        self.lost = None
        self.failure = None
        self.artifacts = [{"name": "release-package", "id": 5, "expired": False}]
        output = io.BytesIO()
        with zipfile.ZipFile(output, "w") as archive:
            for path in folder.iterdir():
                archive.writestr(path.name, path.read_bytes())
        self.archive = output.getvalue()

    def gh(self, endpoint, **kwargs):
        if "/git/ref/tags/" in endpoint:
            return {"object": {"type": "commit", "sha": self.ctx["sha"]}}
        if "/artifacts?" in endpoint:
            return [{"total_count": len(self.artifacts), "artifacts": self.artifacts}]
        if endpoint.endswith("/artifacts/5/zip"):
            return self.archive
        raise AssertionError(endpoint)

    def integrity(self, target, version):
        self.reads.append(target)
        if self.failure == target:
            raise release.ReleaseError("metadata unavailable")
        return self.values[target]

    def npm(self, target, args):
        assert args[0] == "publish", args
        self.assert_preflight()
        if self.failure == "write":
            return subprocess.CompletedProcess(args, 1, b"", b"failure")
        self.values[target] = self.plan["packages"][target]["integrity"]
        self.writes.append((target, list(args)))
        if self.stop == target:
            self.stop = None
            raise Terminated(target)
        status = 1 if self.lost == target else 0
        self.lost = None
        return subprocess.CompletedProcess(args, status, b"", b"")

    def assert_preflight(self):
        assert set(self.reads[:2]) == set(release.TARGETS), self.reads


class PackageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.tmp.name)
        cls.source = cls.root / "source"
        cls.source.mkdir()
        (cls.source / "dist").mkdir()
        for name in ("index.cjs", "index.mjs", "index.d.ts"):
            (cls.source / "dist" / name).write_text("export {};\n")
        for name in ("README.md", "LICENSE"):
            (cls.source / name).write_text("Fixture\n")
        (cls.source / "package.json").write_text(json.dumps({"name": "ui", "version": "0.0.0", "files": ["dist", "README.md"]}))
        cls.ctx = dict(repository="BitcreditProtocol/ui", sha="a" * 40, run_id="123",
                       version="1.2.3-alpha.1", tag="v1.2.3-alpha.1")
        cls.folder = cls.root / "saved"
        release.prepare(cls.folder, cls.source, cls.ctx)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def publish(self, remote, target):
        with patch.object(release, "gh", side_effect=remote.gh), \
                patch.object(release, "integrity", side_effect=remote.integrity), \
                patch.object(release, "npm", side_effect=remote.npm), \
                patch.object(release, "canonical_version", return_value=self.ctx["version"]), \
                patch.object(release, "note"):
            release.publish(self.folder, self.ctx, target)

    def test_channels_cover_prerelease_and_build_metadata(self):
        for version, expected in {
            "1.2.3": "latest", "1.2.3+build.7": "latest", "1.2.3-alpha.1": "alpha",
            "1.2.3-beta.1+build": "beta", "1.2.3-rc.1": "rc", "1.2.3-test": "test",
            "1.2.3-preview.1": "next", "1.2.3-alpha-custom": "next",
        }.items():
            with self.subTest(version=version):
                self.assertEqual(release.channel(version), expected)

    def test_strict_native_npm_version_validation(self):
        for version in ("1.2.3", "1.2.3-alpha.1", "1.2.3+build", "1.2.3-rc.1+build"):
            self.assertEqual(release.canonical_version(version), version.split("+", 1)[0])
        for version in ("01.2.3", "1.2.3.4", "1.2.3-01", "1.2.3+", "1.2.3+a..b", "--prefix=/tmp"):
            with self.subTest(version=version), self.assertRaises(release.ReleaseError):
                release.canonical_version(version)

    def test_successful_both_registries_and_repeat(self):
        remote = Remote(self.folder, self.ctx)
        for target in release.TARGETS:
            self.publish(remote, target)
        self.assertEqual(len(remote.writes), 2)
        for target in release.TARGETS:
            self.publish(remote, target)
        self.assertEqual(len(remote.writes), 2)
        for target, args in remote.writes:
            self.assertEqual(args[args.index("--tag") + 1], "alpha")

    def test_partial_publication_and_process_stop_resume(self):
        for target in release.TARGETS:
            with self.subTest(target=target):
                remote = Remote(self.folder, self.ctx)
                remote.stop = target
                with self.assertRaises(Terminated):
                    self.publish(remote, target)
                for registry in release.TARGETS:
                    self.publish(remote, registry)
                self.assertEqual([name for name, _ in remote.writes].count(target), 1)
                self.assertEqual(len(remote.writes), 2)

    def test_lost_response_is_resolved_without_republication(self):
        for target in release.TARGETS:
            with self.subTest(target=target):
                remote = Remote(self.folder, self.ctx)
                remote.lost = target
                self.publish(remote, target)
                self.publish(remote, target)
                self.assertEqual(len(remote.writes), 1)

    def test_conflict_in_either_registry_prevents_writes(self):
        for target in release.TARGETS:
            with self.subTest(target=target):
                remote = Remote(self.folder, self.ctx)
                remote.values[target] = "sha512-wrong"
                with self.assertRaises(release.ReleaseError):
                    self.publish(remote, "npmjs")
                self.assertEqual(remote.writes, [])

    def test_read_and_write_failures_are_not_success(self):
        for operation in ("github", "npmjs", "write"):
            with self.subTest(operation=operation):
                remote = Remote(self.folder, self.ctx)
                remote.failure = operation
                with self.assertRaises(release.ReleaseError):
                    self.publish(remote, "npmjs")
                self.assertEqual(remote.writes, [])

    def test_missing_expired_corrupted_and_malformed_artifact(self):
        for failure in ("missing", "expired", "corrupt", "malformed"):
            with self.subTest(failure=failure):
                remote = Remote(self.folder, self.ctx)
                if failure == "missing":
                    remote.artifacts = []
                elif failure == "expired":
                    remote.artifacts[0]["expired"] = True
                elif failure == "malformed":
                    remote.artifacts = [{"id": 5, "expired": False}]
                else:
                    remote.archive = b"broken"
                with self.assertRaises((release.ReleaseError, zipfile.BadZipFile)):
                    self.publish(remote, "npmjs")
                self.assertEqual(remote.writes, [])

    def test_changed_source_or_run_cannot_restore(self):
        remote = Remote(self.folder, self.ctx)
        for key, value in (("sha", "b" * 40), ("run_id", "456")):
            with self.subTest(key=key), tempfile.TemporaryDirectory() as tmp, \
                    patch.object(release, "gh", side_effect=remote.gh):
                with self.assertRaises(release.ReleaseError):
                    release.restore(Path(tmp), {**self.ctx, key: value}, required=True)

    def restore_absent(self, artifact_pages, history=None, attempt="1"):
        def read(endpoint, **kwargs):
            if "/artifacts?" in endpoint:
                return artifact_pages
            previous = int(endpoint.split("/attempts/")[1].split("/")[0])
            value = history[previous]
            if isinstance(value, Exception):
                raise value
            return value
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, {"GITHUB_RUN_ATTEMPT": attempt}), \
                patch.object(release, "gh", side_effect=read), patch.object(release, "verify_tag"), \
                patch.object(release, "integrity", return_value=None), \
                patch.object(release, "canonical_version", return_value=self.ctx["version"]):
            destination = Path(tmp) / "restored"
            result = release.restore(destination, self.ctx)
            self.assertFalse(destination.exists())
            return result

    def preparation_history(self, *, conclusion="skipped", attempt=1):
        return [{"total_count": 1, "jobs": [{"id": 10, "run_id": 123, "run_attempt": attempt,
            "head_sha": self.ctx["sha"], "name": "Build release package", "status": "completed",
            "conclusion": "failure", "steps": [{"number": 6, "name": "Save immutable packages before publication",
                                                  "status": "completed", "conclusion": conclusion}]}]}]

    def test_artifact_counts_cannot_turn_incomplete_read_into_preparation(self):
        row = {"id": 6, "name": "other", "expired": False}
        for pages in ([{"total_count": 1, "artifacts": []}], [{"artifacts": []}],
                      [{"total_count": True, "artifacts": [row]}],
                      [{"total_count": 2, "artifacts": [row, row]}],
                      [{"total_count": 1, "artifacts": [row]}, {"total_count": 0, "artifacts": []}]):
            with self.subTest(pages=pages), self.assertRaises(release.ReleaseError):
                self.restore_absent(pages)
        self.assertFalse(self.restore_absent([{"total_count": 0, "artifacts": []}]))
        with patch.object(release, "gh", return_value=[{"total_count": 2, "artifacts": [row]},
                         {"total_count": 2, "artifacts": [{**row, "id": 7}]}]):
            self.assertEqual([v["id"] for v in release.pages("fixture", "artifacts")], [6, 7])

    def test_deleted_package_is_not_rebuilt_before_publication(self):
        empty = [{"total_count": 0, "artifacts": []}]
        for conclusion in ("success", "failure", "cancelled"):
            with self.subTest(conclusion=conclusion), self.assertRaisesRegex(release.ReleaseError, "refusing replacement"):
                self.restore_absent(empty, {1: self.preparation_history(conclusion=conclusion)}, "2")
        self.assertFalse(self.restore_absent(empty, {1: self.preparation_history()}, "2"))
        with self.assertRaisesRegex(release.ReleaseError, "refusing replacement"):
            self.restore_absent(empty, {1: self.preparation_history(conclusion="success"),
                                       2: self.preparation_history(attempt=2)}, "3")

    def test_unmeasured_prior_preparation_cannot_authorize_rebuild(self):
        wrong_sha = self.preparation_history()
        wrong_sha[0]["jobs"][0]["head_sha"] = "b" * 40
        missing_step = self.preparation_history()
        missing_step[0]["jobs"][0]["steps"] = []
        for history in (wrong_sha, missing_step, [{"total_count": 1, "jobs": []}],
                        release.ReleaseError("history unavailable")):
            with self.subTest(history=history), self.assertRaises(release.ReleaseError):
                self.restore_absent([{"total_count": 0, "artifacts": []}], {1: history}, "2")

    def test_http_error_is_not_missing_artifact(self):
        for status in (403, 404, 429, 500):
            with self.subTest(status=status), patch.object(release, "command", return_value=
                    subprocess.CompletedProcess([], 1, b"", f"HTTP {status}".encode())):
                with self.assertRaises(release.ReleaseError):
                    release.gh("test")

    def test_registry_metadata_requires_integrity(self):
        for output, status in ((b"null", 0), (b"broken", 0), (b'{"error":{"code":"E403"}}', 1)):
            with self.subTest(output=output), patch.object(release, "npm", return_value=
                    subprocess.CompletedProcess([], status, output, b"")):
                with self.assertRaises(release.ReleaseError):
                    release.integrity("npmjs", "1.2.3")

    def test_artifact_download_uses_the_actions_api_media_type(self):
        def transport(args, **kwargs):
            if "Accept: application/octet-stream" in args:
                return subprocess.CompletedProcess(args, 1, b"", b"HTTP 415")
            return subprocess.CompletedProcess(args, 0, b"archive-bytes", b"")
        with patch.object(release, "command", side_effect=transport):
            self.assertEqual(release.gh("repos/example/repo/actions/artifacts/5/zip", raw=True), b"archive-bytes")

    def test_both_packages_preserve_build_metadata(self):
        ctx = {**self.ctx, "version": "1.2.3+build.7", "tag": "v1.2.3+build.7"}
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp) / "saved"
            release.prepare(folder, self.source, ctx)
            plan = release.validate(folder, ctx)
            self.assertEqual(plan["version"], ctx["version"])
            self.assertEqual(set(plan["packages"]), {"github", "npmjs"})
            for info in plan["packages"].values():
                self.assertEqual(info["registry_version"], "1.2.3")

    def test_app_bundle_cannot_be_published(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "source"
            import shutil
            shutil.copytree(self.source, source)
            (source / "dist/index.html").write_text("<html></html>")
            with self.assertRaises(release.ReleaseError):
                release.prepare(Path(tmp) / "saved", source, self.ctx)


if __name__ == "__main__":
    unittest.main()
