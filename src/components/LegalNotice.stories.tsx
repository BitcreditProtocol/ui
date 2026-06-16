import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { LegalNotice } from "./LegalNotice";

const locale = "en-US";
const messages = {
  "ui.drawer.actions.close": "Close",
  "ui.legalNotice.actions.close": "Close",
  "ui.legalNotice.actions.downloadPdf": "Download PDF",
  "ui.legalNotice.content.summary.heading": "Summary:",
  "ui.legalNotice.content.summary.text": "Example content supplied by the consuming app.",
  "ui.legalNotice.content.termsOfUse.heading": "Terms of Use:",
  "ui.legalNotice.content.termsOfUse.paragraph1": "Example paragraph 1.",
  "ui.legalNotice.content.termsOfUse.paragraph2": "Example paragraph 2.",
  "ui.legalNotice.content.termsOfUse.paragraph3": "Example paragraph 3.",
  "ui.legalNotice.content.termsOfUse.paragraph4": "Example paragraph 4.",
  "ui.legalNotice.content.termsOfUse.paragraph5": "Example paragraph 5.",
  "ui.legalNotice.content.termsOfUse.paragraph6": "Example paragraph 6.",
  "ui.legalNotice.content.termsOfUse.paragraph7": "Example paragraph 7.",
  "ui.legalNotice.content.termsOfUse.paragraph8": "Example paragraph 8.",
  "ui.legalNotice.content.title": "Legal Notice",
  "ui.legalNotice.page.title": "Legal Notice",
  "ui.legalNotice.review.description": "Legal notice drawer content",
  "ui.legalNotice.review.title": "Legal Notice",
  "ui.legalNotice.review.trigger": "Legal Notice",
} as const;

const protocolRulesPdfText = `Part I - Legal Notice

This notice applies to Bitcredit eBill App releases from 0.9.1. The eBill App is open-source, non-custodial software.

The software enables participants to interact in accordance with the Protocol Rules in Part II.

Participants may use different identity levels depending on the functions used. Certain functions may require a name, email, and address, a pseudonym is sufficient for limited functionality. Certain functions may rely on services provided by independent Bitcredit credit mints, including email verification.

Users retain sole control over their private keys, signatures, e-bills, and transactions.

The software supports recovery using backups, or a recovery phrase and Bitcredit Network records maintained by the participant's service mint. Users are responsible for creating, securing, and updating their recovery information.

Users are responsible for verifying the identity, authority, creditworthiness, and authenticity of their counterparty contacts.

Users are responsible for the legal and commercial consequences of their actions under the Bitcredit Protocol Rules below.

The software may contain bugs, security weaknesses, or other defects. Users should exercise appropriate care and avoid relying on the software without independent verification.

The software, protocol, and network infrastructure are developed, maintained, and operated by independent contributors. No person or entity is under any obligation to continue developing, maintaining, supporting, or operating any part of the software, protocol, or network.

The software is provided as-is, without warranty of any kind. Use of the software is entirely at the user's own risk.

To the maximum extent permitted by applicable law, contributors shall not be liable for any damages, losses, claims, costs, or expenses arising from the use of the software.

Use of the software constitutes acceptance of this notice and these Protocol Rules.

This notice may be updated from time to time. The version accompanying the software release shall apply.

Part II - Protocol Rules

These rules supplement applicable law and define the operation of Bitcredit e-bills within the Bitcredit Network.

§1 Governing Law: Bitcredit e-bills are intended to operate under the law of England and Wales relating to bills of exchange and electronic trade documents.

§2 Identity: Every eBill user has a Bitcredit public identifier. A participant may operate under a pseudonym or under a personal or business identity. A participant may act on behalf of one or more businesses or organisations. A business or organisation may authorise one or more participants to act on its behalf.

§3 Email: Bitcredit does not perform identity verification or validation of participant identities. An email verification status by the user's service mint is represented within the Bitcredit system solely as an attribute associated with the participant's identity. Control of the private key corresponding to the identifier establishes control of that identity.

§3 Issuance: An e-bill is issued when a drawer signs it using the private key of its Bitcredit identity. Bitcredit supports promissory notes, self-drawn bills, and bills drawn on third parties.

§4 Supporting Documents: Invoices supporting the value of the underlying transaction shall be attached to the e-bill.

§5 Signatures: A valid signature is created using the private key corresponding to a participant's Bitcredit public identity.

§6 Possession: The holder of an e-bill is the participant having exclusive control of its current state.

§7 Delivery: E-bills are transported and delivered through the Bitcredit Network.

§8 Presentment: Presentment for acceptance, payment, or recourse shall be made by a holder using a valid signature.

§9 Acceptance: Acceptance or rejection shall be recorded by a valid signature of the party on whom the bill is drawn.

§10 Endorsement: A holder may endorse an e-bill to a named holder or to bearer using a valid signature.

§11 Payment: Payment shall be made on the Bitcoin blockchain. Proof of payment shall be established by a Bitcoin transaction associated with the e-bill and a rightful holder.

§12 Verification: The authenticity and history of a Bitcredit e-bill may be verified using its signatures and Bitcredit Protocol records.

§13 Evidence: Evidence may include signatures, invoice attachments, endorsement history, acceptance history, Bitcredit Network records, and Bitcoin blockchain records.

§14 Dishonour: An e-bill is dishonoured when acceptance or payment is refused or not performed as required by the bill.

§15 Enforcement: Rights arising from a Bitcredit e-bill may be enforced in any competent jurisdiction. Bitcredit e-bills are intended to be capable of independent verification by courts, arbitrators, and other competent authorities.

Version 1.0.0

2026-06-03`;

const meta = {
  title: "Components/LegalNotice",
  component: LegalNotice,
  decorators: [
    (Story) => (
      <IntlProvider locale={locale} messages={messages}>
        <div className="min-h-[720px] bg-elevation-100 p-6">
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
  argTypes: {
    mode: {
      options: ["drawer", "page"],
      control: { type: "radio" },
    },
    hidePageHeading: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof LegalNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

const longTermsContent = (
  <div className="text-text-200 text-xs leading-normal whitespace-pre-wrap break-words">
    <p className="font-medium mb-2">Long Form Legal Notice</p>
    <p className="mt-4 mb-2">Summary:</p>
    <p>
      This story intentionally contains long content to verify drawer behavior with overflow, including max-height handling and bottom
      gradient fade while additional content remains below the fold.
    </p>
    <p className="mt-4 mb-2">Terms:</p>
    {Array.from({ length: 20 }, (_, idx) => (
      <p key={`term-${idx + 1}`} className="mt-2">
        {idx + 1}. This is test paragraph {idx + 1} used to simulate extended legal copy for scrolling behavior inside the drawer content
        area.
      </p>
    ))}
  </div>
);

const protocolRulesContent = (
  <div className="text-black whitespace-pre-wrap break-words text-sm leading-5 font-normal [&_strong]:font-medium [&_strong]:text-text-300">
    <p className="mt-4 mb-4 text-base leading-6 font-medium text-text-300">Part I — Legal Notice</p>
    <p>This notice applies to Bitcredit eBill App releases from 0.9.1. The eBill App is open-source, non-custodial software.</p>
    <p className="mt-[14px]">The software enables participants to interact in accordance with the Protocol Rules in Part II.</p>
    <p className="mt-[14px]">
      Participants may use different identity levels depending on the functions used. Certain functions may require a name, email, and
      address, a pseudonym is sufficient for limited functionality. Certain functions may rely on services provided by independent Bitcredit
      credit mints, including email verification.
    </p>
    <p className="mt-[14px]">Users retain sole control over their private keys, signatures, e-bills, and transactions.</p>
    <p className="mt-[14px]">
      The software supports recovery using backups, or a recovery phrase and Bitcredit Network records maintained by the participant's
      service mint. Users are responsible for creating, securing, and updating their recovery information.
    </p>
    <p className="mt-[14px]">
      Users are responsible for verifying the identity, authority, creditworthiness, and authenticity of their counterparty contacts.
    </p>
    <p className="mt-[14px]">
      Users are responsible for the legal and commercial consequences of their actions under the Bitcredit Protocol Rules below.
    </p>
    <p className="mt-[14px]">
      The software may contain bugs, security weaknesses, or other defects. Users should exercise appropriate care and avoid relying on the
      software without independent verification.
    </p>
    <p className="mt-[14px]">
      The software, protocol, and network infrastructure are developed, maintained, and operated by independent contributors. No person or
      entity is under any obligation to continue developing, maintaining, supporting, or operating any part of the software, protocol, or
      network.
    </p>
    <p className="mt-[14px]">
      The software is provided as-is, without warranty of any kind. Use of the software is entirely at the user's own risk.
    </p>
    <p className="mt-[14px]">
      To the maximum extent permitted by applicable law, contributors shall not be liable for any damages, losses, claims, costs, or
      expenses arising from the use of the software.
    </p>
    <p className="mt-[14px]">Use of the software constitutes acceptance of this notice and these Protocol Rules.</p>
    <p className="mt-[14px]">This notice may be updated from time to time. The version accompanying the software release shall apply.</p>

    <p className="mt-4 mb-4 text-base leading-6 font-medium text-text-300">Part II — Protocol Rules</p>
    <p>These rules supplement applicable law and define the operation of Bitcredit e-bills within the Bitcredit Network.</p>
    <p className="mt-[14px]">
      <strong>§1 Governing Law:</strong> Bitcredit e-bills are intended to operate under the law of England and Wales relating to bills of
      exchange and electronic trade documents.
    </p>
    <p className="mt-[14px]">
      <strong>§2 Identity:</strong> Every eBill user has a Bitcredit public identifier. A participant may operate under a pseudonym or under
      a personal or business identity. A participant may act on behalf of one or more businesses or organisations. A business or
      organisation may authorise one or more participants to act on its behalf.
    </p>
    <p className="mt-[14px]">
      <strong>§3 Email:</strong> Bitcredit does not perform identity verification or validation of participant identities. An email
      verification status by the user’s service mint is represented within the Bitcredit system solely as an attribute associated with the
      participant’s identity. Control of the private key corresponding to the identifier establishes control of that identity.
    </p>
    <p className="mt-[14px]">
      <strong>§3 Issuance:</strong> An e-bill is issued when a drawer signs it using the private key of its Bitcredit identity. Bitcredit
      supports promissory notes, self-drawn bills, and bills drawn on third parties.
    </p>
    <p className="mt-[14px]">
      <strong>§4 Supporting Documents:</strong> Invoices supporting the value of the underlying transaction shall be attached to the e-bill.
    </p>
    <p className="mt-[14px]">
      <strong>§5 Signatures:</strong> A valid signature is created using the private key corresponding to a participant's Bitcredit public
      identity.
    </p>
    <p className="mt-[14px]">
      <strong>§6 Possession:</strong> The holder of an e-bill is the participant having exclusive control of its current state.
    </p>
    <p className="mt-[14px]">
      <strong>§7 Delivery:</strong> E-bills are transported and delivered through the Bitcredit Network.
    </p>
    <p className="mt-[14px]">
      <strong>§8 Presentment:</strong> Presentment for acceptance, payment, or recourse shall be made by a holder using a valid signature.
    </p>
    <p className="mt-[14px]">
      <strong>§9 Acceptance:</strong> Acceptance or rejection shall be recorded by a valid signature of the party on whom the bill is drawn.
    </p>
    <p className="mt-[14px]">
      <strong>§10 Endorsement:</strong> A holder may endorse an e-bill to a named holder or to bearer using a valid signature.
    </p>
    <p className="mt-[14px]">
      <strong>§11 Payment:</strong> Payment shall be made on the Bitcoin blockchain. Proof of payment shall be established by a Bitcoin
      transaction associated with the e-bill and a rightful holder.
    </p>
    <p className="mt-[14px]">
      <strong>§12 Verification:</strong> The authenticity and history of a Bitcredit e-bill may be verified using its signatures and
      Bitcredit Protocol records.
    </p>
    <p className="mt-[14px]">
      <strong>§13 Evidence:</strong> Evidence may include signatures, invoice attachments, endorsement history, acceptance history,
      Bitcredit Network records, and Bitcoin blockchain records.
    </p>
    <p className="mt-[14px]">
      <strong>§14 Dishonour:</strong> An e-bill is dishonoured when acceptance or payment is refused or not performed as required by the
      bill.
    </p>
    <p className="mt-[14px]">
      <strong>§15 Enforcement:</strong> Rights arising from a Bitcredit e-bill may be enforced in any competent jurisdiction. Bitcredit
      e-bills are intended to be capable of independent verification by courts, arbitrators, and other competent authorities.
    </p>
  </div>
);

export const DrawerMode: Story = {
  args: {
    mode: "drawer",
    content: protocolRulesContent,
    downloadPdf: {
      fileName: "legal-notice.pdf",
      text: protocolRulesPdfText,
    },
    footer: {
      version: "Version 1.0.0",
      date: "2026-06-03",
    },
  },
};

export const PageMode: Story = {
  args: {
    mode: "page",
    content: protocolRulesContent,
    downloadPdf: {
      fileName: "legal-notice.pdf",
      text: protocolRulesPdfText,
    },
    footer: {
      version: "Version 1.0.0",
      date: "2026-06-03",
    },
  },
};

export const CustomContent: Story = {
  args: {
    mode: "drawer",
    labels: {
      trigger: "House Rules",
      drawerTitle: "House Rules",
      drawerDescription: "Custom legal and compliance text supplied by the consuming app",
      pageTitle: "House Rules",
    },
    content: (
      <div className="text-text-200 text-xs leading-normal whitespace-pre-wrap break-words">
        <p className="font-medium mb-2">Marketplace Agreement</p>
        <p className="mt-4 mb-2">Summary:</p>
        <p>This content is supplied by the consuming app instead of the UI library defaults.</p>
        <p className="mt-4 mb-2">Terms:</p>
        <p>The app can provide its own wording, legal copy, and structure here.</p>
      </div>
    ),
  },
};

export const DrawerModeLongContent: Story = {
  args: {
    mode: "drawer",
    labels: {
      trigger: "Review Long Notice",
      drawerTitle: "Long Legal Notice",
      drawerDescription: "Long legal notice content used to validate drawer overflow behavior",
      pageTitle: "Long Legal Notice",
    },
    content: longTermsContent,
  },
};

export const PageModeWithoutHeading: Story = {
  args: {
    mode: "page",
    hidePageHeading: true,
  },
};
