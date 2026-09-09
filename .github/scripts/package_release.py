#!/usr/bin/env python3
"""Prepare both registry packages once and resume publication from saved bytes."""

import base64
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from urllib.parse import quote
import zipfile

PLAN = "release-plan.json"
TARGETS = {
    "npmjs": ("https://registry.npmjs.org", "@bitcredit/ui-library"),
    "github": ("https://npm.pkg.github.com", "@bitcreditprotocol/ui-library"),
}


class ReleaseError(RuntimeError):
    pass


def command(args, **kwargs):
    return subprocess.run(args, capture_output=True, **kwargs)


def gh(endpoint, *, raw=False, missing=False, paginate=False):
    args = ["gh", "api", endpoint]
    if paginate:
        args += ["--paginate", "--slurp"]
    result = command(args)
    if result.returncode:
        status = re.search(rb"HTTP (\d+)", result.stderr)
        status = status[1].decode() if status else "unknown"
        if missing and status == "404":
            return None
        raise ReleaseError(f"GitHub read failed (HTTP {status})")
    if raw:
        return result.stdout
    try:
        return json.loads(result.stdout)
    except ValueError as error:
        raise ReleaseError("GitHub returned invalid JSON") from error


def canonical_version(version):
    if not isinstance(version, str) or not re.fullmatch(r"[0-9][0-9A-Za-z.+-]*", version):
        raise ReleaseError("Invalid version syntax")
    base, separator, build = version.partition("+")
    if separator and not re.fullmatch(r"[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*", build):
        raise ReleaseError("Invalid SemVer build metadata")
    with tempfile.TemporaryDirectory() as tmp:
        package = Path(tmp) / "package.json"
        package.write_text('{"name":"release-version-check","version":"0.0.0"}')
        result = command(["npm", "version", version, "--allow-same-version", "--no-git-tag-version", "--ignore-scripts",
                          "--cache", str(Path(tmp) / "cache")], cwd=tmp)
        normalized = json.loads(package.read_text())["version"]
        # npm's loose coercion is not allowed; build metadata is not registry identity.
        if result.returncode or normalized != base:
            raise ReleaseError("Version is not strict SemVer")
    return normalized


def channel(version):
    base = version.split("+", 1)[0]
    if "-" not in base:
        return "latest"
    first = base.split("-", 1)[1].split(".", 1)[0]
    return first if first in ("alpha", "beta", "rc", "test") else "next"


def context(version=None):
    repo, sha, run = (os.environ[name] for name in ("GITHUB_REPOSITORY", "GITHUB_SHA", "GITHUB_RUN_ID"))
    if repo != "BitcreditProtocol/ui" or not re.fullmatch(r"[0-9a-f]{40}", sha) or not run.isdigit():
        raise ReleaseError("Invalid package run identity")
    if version is None:
        tag = os.environ["GITHUB_REF_NAME"]
        if not tag.startswith("v"):
            raise ReleaseError("Package release requires a v-prefixed tag")
        version = tag[1:]
    canonical_version(version)
    return dict(repository=repo, sha=sha, run_id=run, version=version, tag="v" + version)


def verify_tag(ctx):
    value = gh(f"repos/{ctx['repository']}/git/ref/tags/{quote(ctx['tag'], safe='')}")
    obj = value["object"]
    for _ in range(20):
        if obj.get("type") == "commit":
            if obj.get("sha") != ctx["sha"]:
                raise ReleaseError("Tag no longer points to the saved source")
            return
        if obj.get("type") != "tag" or not re.fullmatch(r"[0-9a-f]{40}", obj.get("sha", "")):
            break
        obj = gh(f"repos/{ctx['repository']}/git/tags/{obj['sha']}")["object"]
    raise ReleaseError("Invalid tag response")


def npm(target, args):
    registry, name = TARGETS[target]
    with tempfile.TemporaryDirectory() as tmp:
        config = Path(tmp) / "npmrc"
        config.write_text(f"registry={registry}\n" + (
            f"{name.split('/')[0]}:registry={registry}\n//npm.pkg.github.com/:_authToken=" + "${NODE_AUTH_TOKEN}\n"
            if target == "github" else ""
        ))
        env = dict(os.environ)
        if target == "github":
            env["NODE_AUTH_TOKEN"] = env.get("GH_TOKEN", "")
        return command(["npm", *args, "--registry", registry, "--userconfig", str(config)], env=env)


def integrity(target, version):
    result = npm(target, ["view", TARGETS[target][1] + "@" + version, "dist.integrity", "--json"])
    try:
        value = json.loads(result.stdout)
    except ValueError as error:
        raise ReleaseError(f"{target}: invalid npm response") from error
    if result.returncode:
        if isinstance(value, dict) and value.get("error", {}).get("code") == "E404":
            return None
        raise ReleaseError(f"{target}: npm metadata read failed")
    if not isinstance(value, str) or not value.startswith("sha512-"):
        raise ReleaseError(f"{target}: npm integrity is unmeasured")
    return value


def checksum(path, algorithm="sha256"):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, algorithm).digest()


def validate(folder, ctx):
    plan = json.loads((folder / PLAN).read_text())
    if plan.get("schema") != 1 or any(plan.get(key) != value for key, value in ctx.items()):
        raise ReleaseError("Package artifact belongs to a different source or run")
    packages = plan.get("packages")
    if not isinstance(packages, dict) or set(packages) != set(TARGETS):
        raise ReleaseError("Package artifact must contain both registry packages")
    if {p.name for p in folder.iterdir()} != {PLAN, "npmjs.tgz", "github.tgz"}:
        raise ReleaseError("Unexpected artifact files")
    version = canonical_version(ctx["version"])
    for target, (registry, name) in TARGETS.items():
        info = packages[target]
        path = folder / (target + ".tgz")
        if (not isinstance(info, dict) or info.get("name") != name or info.get("registry") != registry
                or info.get("registry_version") != version or path.is_symlink() or not path.is_file()
                or path.stat().st_size != info.get("size") or checksum(path).hex() != info.get("sha256")
                or "sha512-" + base64.b64encode(checksum(path, "sha512")).decode() != info.get("integrity")):
            raise ReleaseError(f"{target}: invalid saved package")
        with tarfile.open(path, "r:gz") as archive:
            manifest = json.load(archive.extractfile("package/package.json"))
            if manifest.get("name") != name or manifest.get("version") != ctx["version"]:
                raise ReleaseError(f"{target}: archive manifest mismatch")
            names = set(archive.getnames())
            for required in ("dist/index.cjs", "dist/index.mjs", "dist/index.d.ts"):
                member = archive.getmember("package/" + required)
                if not member.isfile() or member.size == 0:
                    raise ReleaseError(f"{target}: required library output is missing")
            if "package/dist/index.html" in names:
                raise ReleaseError(f"{target}: app bundle must not be published")
    return plan


def restore(folder, ctx, required=False):
    verify_tag(ctx)
    result = gh(f"repos/{ctx['repository']}/actions/runs/{ctx['run_id']}/artifacts?per_page=100", paginate=True)
    if not isinstance(result, list) or not result:
        raise ReleaseError("Invalid artifact page envelope")
    rows = []
    for page in result:
        if not isinstance(page, dict) or not isinstance(page.get("artifacts"), list):
            raise ReleaseError("Invalid artifact response")
        rows.extend(page["artifacts"])
    if any(not isinstance(row, dict) or type(row.get("id")) is not int or row["id"] <= 0
           or not isinstance(row.get("name"), str) or not row["name"]
           or type(row.get("expired")) is not bool for row in rows):
        raise ReleaseError("Invalid artifact identity")
    candidates = [row for row in rows if row["name"] == "release-package"]
    if not candidates:
        if required:
            raise ReleaseError("Original package artifact is missing")
        version = canonical_version(ctx["version"])
        existing = {target: integrity(target, version) for target in TARGETS}
        if any(value is not None for value in existing.values()):
            raise ReleaseError("Publication exists without its original package artifact")
        return False
    if len(candidates) != 1 or candidates[0]["expired"]:
        raise ReleaseError("Package artifact is ambiguous or expired")
    payload = gh(f"repos/{ctx['repository']}/actions/artifacts/{candidates[0]['id']}/zip", raw=True)
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        names = [item.filename for item in archive.infolist() if not item.is_dir()]
        if sorted(names) != sorted([PLAN, "npmjs.tgz", "github.tgz"]):
            raise ReleaseError("Unexpected package archive entries")
        folder.mkdir(parents=True, exist_ok=True)
        for name in names:
            (folder / name).write_bytes(archive.read(name))
    validate(folder, ctx)
    note(f"Restored artifact {candidates[0]['id']} from original run {ctx['run_id']}.")
    return True


def prepare(folder, source, ctx):
    version = canonical_version(ctx["version"])
    folder.mkdir(parents=True, exist_ok=False)
    packages = {}
    for target, (registry, name) in TARGETS.items():
        with tempfile.TemporaryDirectory() as tmp:
            staging = Path(tmp)
            shutil.copytree(source / "dist", staging / "dist")
            for filename in ("README.md", "LICENSE"):
                shutil.copyfile(source / filename, staging / filename)
            manifest = json.loads((source / "package.json").read_text())
            manifest.update(name=name, version=ctx["version"], repository={
                "type": "git", "url": f"git+https://github.com/{ctx['repository']}.git",
            })
            manifest.pop("private", None)
            (staging / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
            result = command(["npm", "pack", "--json", "--ignore-scripts", "--pack-destination", str(folder.resolve())], cwd=staging)
            if result.returncode:
                raise ReleaseError(f"{target}: npm pack failed")
            filename = json.loads(result.stdout)[0]["filename"]
            if Path(filename).name != filename:
                raise ReleaseError("Invalid npm archive path")
            path = folder / (target + ".tgz")
            (folder / filename).rename(path)
            packages[target] = dict(name=name, registry=registry, registry_version=version,
                                    size=path.stat().st_size, sha256=checksum(path).hex(),
                                    integrity="sha512-" + base64.b64encode(checksum(path, "sha512")).decode())
    plan = dict(schema=1, **ctx, packages=packages)
    (folder / PLAN).write_text(json.dumps(plan, indent=2, sort_keys=True) + "\n")
    validate(folder, ctx)
    note(f"Prepared both registry archives for {ctx['tag']} ({ctx['sha']}).")


def note(message):
    print(message)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as stream:
            stream.write("- " + message + "\n")


def publish(folder, ctx, target):
    plan = validate(folder, ctx)
    with tempfile.TemporaryDirectory() as tmp:
        saved = Path(tmp)
        restore(saved, ctx, required=True)
        if validate(saved, ctx) != plan:
            raise ReleaseError("Local packages differ from the immutable artifact")
    version = canonical_version(ctx["version"])
    existing = {key: integrity(key, version) for key in TARGETS}
    for key, value in existing.items():
        if value is not None and value != plan["packages"][key]["integrity"]:
            raise ReleaseError(f"{key}: published version contains different bytes")
    if existing[target] is not None:
        note(f"{target}: matching publication preserved.")
        return
    args = ["publish", str((folder / (target + ".tgz")).resolve()), "--ignore-scripts", "--tag", channel(ctx["version"])]
    if target == "npmjs":
        args += ["--access", "public"]
    # Always read back, including after an ambiguous nonzero command response.
    npm(target, args)
    if integrity(target, version) != plan["packages"][target]["integrity"]:
        raise ReleaseError(f"{target}: publication unconfirmed; rerun the original run")
    note(f"{target}: package integrity confirmed in channel {channel(ctx['version'])}.")


def main():
    action, folder = sys.argv[1], Path(sys.argv[2]).resolve()
    override = sys.argv[3] if action == "prepare" and len(sys.argv) > 3 else None
    ctx = context(override)
    if action == "restore":
        restored = restore(folder, ctx)
        with open(os.environ["GITHUB_OUTPUT"], "a") as stream:
            stream.write(f"restored={'true' if restored else 'false'}\n")
    elif action == "prepare":
        prepare(folder, Path.cwd(), ctx)
    elif action == "publish":
        if os.environ.get("GITHUB_EVENT_NAME") != "push" or not os.environ.get("GITHUB_REF", "").startswith("refs/tags/v"):
            raise ReleaseError("Publication requires the existing tag-push workflow")
        target = sys.argv[3]
        if target not in TARGETS:
            raise ReleaseError("Unknown registry")
        publish(folder, ctx, target)
    else:
        raise ReleaseError("Unknown package operation")


if __name__ == "__main__":
    try:
        main()
    except (ReleaseError, ValueError, KeyError, TypeError, OSError, tarfile.TarError, zipfile.BadZipFile) as error:
        print(f"Release stopped: {error}", file=sys.stderr)
        sys.exit(1)
