import { FormattedMessage } from "react-intl";
import { Heading } from "@/components/typography/Heading";
import { cn } from "@/lib/utils";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./ui/drawer";

function TermsContent() {
  return (
    <div className="text-text-200 text-xs font-sans font-normal leading-normal whitespace-pre-wrap break-words">
      <p className="font-medium mb-2">
        <FormattedMessage
          id="termsAndConditions.content.title"
          defaultMessage="Bill of Exchange Agreement"
          description="Title of the terms and conditions content"
        />
      </p>

      <p className="mt-4 mb-2">
        <FormattedMessage id="termsAndConditions.content.summary.heading" defaultMessage="Summary:" description="Summary section heading" />
      </p>
      <p>
        <FormattedMessage
          id="termsAndConditions.content.summary.text"
          defaultMessage="Bitcredit's software lets you issue and use bills of exchange digitally. E-Bills have the same key features as handwritten bills but are faster, easier, and cryptographically secure."
          description="Summary description of Bitcredit's E-Bills"
        />
      </p>

      <p className="mt-4 mb-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.heading"
          defaultMessage="Terms of Use:"
          description="Terms of Use section heading"
        />
      </p>
      <p>
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph1"
          defaultMessage="E-Bills reproduce the legal and practical features of handwritten bills of exchange in digital form. They include all required elements and use electronic signatures instead of handwritten ones."
          description="First paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph2"
          defaultMessage="The rightful holder of an E-Bill can always be verified through cryptographic proof."
          description="Second paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph3"
          defaultMessage="By signing or transacting with an E-Bill, you agree that electronic signatures are legally binding."
          description="Third paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph4"
          defaultMessage="Each party is responsible for reasonable due diligence to confirm the identity of their counterparty."
          description="Fourth paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph5"
          defaultMessage="The United Nations Convention on International Bills of Exchange and other applicable international rules apply to all E-Bills, whether domestic or international."
          description="Fifth paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph6"
          defaultMessage="Where legally possible, the parties agree to use fast-track court procedures for bill of exchange disputes to ensure quick decisions."
          description="Sixth paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph7"
          defaultMessage="If a provision of bill of exchange law cannot apply directly to an E-Bill, the closest permissible alternative with the same economic effect shall apply."
          description="Seventh paragraph of Terms of Use"
        />
      </p>
      <p className="mt-2">
        <FormattedMessage
          id="termsAndConditions.content.termsOfUse.paragraph8"
          defaultMessage="If national or international laws recognize E-Bills as equivalent to handwritten bills, those laws will apply automatically."
          description="Eighth paragraph of Terms of Use"
        />
      </p>
    </div>
  );
}

interface TermsAndConditionsProps {
  mode?: "drawer" | "page";
  className?: string;
  hidePageHeading?: boolean;
}

export function TermsAndConditions({ mode = "drawer", className, hidePageHeading = false }: TermsAndConditionsProps) {
  if (mode === "page") {
    return <TermsAndConditionsPage className={className} hidePageHeading={hidePageHeading} />;
  } else {
    return (
      <Drawer>
        <DrawerTrigger className="!bg-transparent">
          <span className="text-brand-200 text-base font-medium -tracking-[0.32px]">
            <FormattedMessage
              id="termsAndConditions.review.terms"
              defaultMessage="Terms and Conditions"
              description="Trigger to terms and conditions drawer"
            />
          </span>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col gap-6 pb-8 px-5 max-w-[430px] bg-elevation-50 mx-auto">
          <DrawerTitle className="text-text-300 text-base font-medium leading-normal text-center">
            <FormattedMessage
              id="termsAndConditions.review.title"
              defaultMessage="Terms"
              description="Title to terms and conditions drawer"
            />
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            <FormattedMessage
              id="termsAndConditions.review.description"
              defaultMessage="Bill of exchange agreement and terms of use for terms and conditions"
              description="Description to terms and conditions drawer"
            />
          </DrawerDescription>

          <TermsContent />
        </DrawerContent>
      </Drawer>
    );
  }
}

function TermsAndConditionsPage({ className, hidePageHeading = false }: { className?: string; hidePageHeading?: boolean }) {
  const Container = hidePageHeading ? "div" : "section";

  return (
    <Container className={cn("mx-auto flex w-full max-w-[430px] flex-col gap-6 rounded-2xl bg-elevation-50 p-5", className)}>
      {!hidePageHeading ? (
        <Heading as="h1" variant="sub">
          <FormattedMessage
            id="termsAndConditions.page.title"
            defaultMessage="Terms and Conditions"
            description="Title for the Terms and Conditions page"
          />
        </Heading>
      ) : null}
      <div className="flex flex-col gap-6">
        <TermsContent />
      </div>
    </Container>
  );
}
