import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalLink, LegalList, LegalPage, LegalSection, LEGAL } from "@/components/store/legal-page";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Pawlix return policy for pet food, toys and accessories — 7-day returns on unused items, quality issues, refunds, and exchanges across the Tricity.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      description={`We want you to shop with confidence. This policy explains how to return eligible products, request refunds, and resolve quality issues for orders delivered in ${siteConfig.location.formatted} and other serviceable areas.`}
      lastUpdated={LEGAL.lastUpdated}
    >
      <LegalSection title="1. Overview">
        <p>
          Most unused and unopened items may be returned within {LEGAL.returnWindowDays} days of delivery for a refund
          or exchange, subject to the conditions below. Because we sell food and hygiene-sensitive products for
          animals, opened consumables cannot be restocked and are generally not returnable unless faulty or damaged in
          transit.
        </p>
        <p>
          This policy applies to online orders placed on {LEGAL.domain}. In-store purchases at our{" "}
          {siteConfig.location.storeCity} counter follow the same principles; keep your receipt or order reference.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligible returns">
        <p>You may return an item if all of the following are true:</p>
        <LegalList
          items={[
            `You contact us within ${LEGAL.returnWindowDays} days of delivery (or pickup) with your order number.`,
            "The product is unused, unopened, and in the same condition you received it, with original packaging intact where applicable.",
            "Tags, seals, and batch labels are present for items that arrived sealed from the manufacturer.",
            "The item is not listed under non-returnable categories below.",
          ]}
        />
        <p>
          Accessories such as leads, bowls, toys, and perches may be returned if unused and in resalable condition.
          Bedding, grooming tools, and items that have touched your pet&apos;s mouth or body cannot be accepted for
          hygiene reasons once used.
        </p>
      </LegalSection>

      <LegalSection title="3. Non-returnable items">
        <p>The following are generally not eligible for return unless defective, damaged on arrival, or incorrect:</p>
        <LegalList
          items={[
            "Opened or partially used pet food, treats, supplements, and wet food pouches or tins.",
            "Products with broken hygiene seals, torn bags, or signs of use.",
            "Items marked final sale or clearance when stated at purchase.",
            "Custom or special-order products sourced specifically for you.",
            "Gift cards or digital products, if offered.",
          ]}
        />
        <p>
          If you received the wrong item or a product that fails quality checks (e.g. swollen packaging, unusual odour,
          visible mould, or manufacturing defect), contact us immediately — these situations are handled separately
          from change-of-mind returns.
        </p>
      </LegalSection>

      <LegalSection title="4. How to start a return">
        <p>
          Email{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-accent hover:text-accent-hover">
            {LEGAL.email}
          </a>{" "}
          with:
        </p>
        <LegalList
          items={[
            "Your order number and the email used at checkout.",
            "The item(s) you wish to return and the reason.",
            "Clear photos if the item is damaged, defective, or not what you ordered.",
          ]}
        />
        <p>
          We will confirm whether the return is approved and provide instructions. Do not send items back without
          approval — unsolicited returns may not be processed.
        </p>
        <p>
          For Tricity customers, approved items may sometimes be dropped at our {siteConfig.location.storeCity}{" "}
          counter during business hours instead of using a courier. We will confirm the option when we approve your
          return.
        </p>
      </LegalSection>

      <LegalSection title="5. Return shipping">
        <p>
          If you change your mind on an eligible unopened item, you are responsible for return shipping unless we
          made an error (wrong product sent, defective item, or damage in transit). We may arrange pickup in{" "}
          {siteConfig.location.formatted} for approved returns where practical; any cost will be stated upfront.
        </p>
        <p>
          Original outbound shipping charges are non-refundable except where the return is due to our mistake or a
          defective product. Free-shipping orders that are partially returned may have standard delivery fees deducted
          from the refund where applicable.
        </p>
      </LegalSection>

      <LegalSection title="6. Inspection and processing">
        <p>
          Returned items are inspected on receipt. Refunds or exchanges are processed only after inspection confirms
          the product meets the conditions above. We aim to complete inspection within 3–5 business days of receiving
          the return.
        </p>
        <p>
          If an item fails inspection (used, opened when not permitted, or missing packaging), we may decline the
          refund and offer to return the item to you at your cost, or dispose of it if unclaimed after reasonable
          notice.
        </p>
      </LegalSection>

      <LegalSection title="7. Refunds">
        <p>
          Approved refunds are issued to the original payment method used for the order. Processing times depend on
          your bank or card issuer — typically 5–10 business days after we initiate the refund.
        </p>
        <p>
          Refunds include the product price paid after discounts. Shipping charges are refunded only where required
          under this policy or applicable law. Cash refunds at the counter are available for eligible in-store
          purchases where the original payment was cash or UPI and records allow verification.
        </p>
      </LegalSection>

      <LegalSection title="8. Exchanges">
        <p>
          If you need a different size, variant, or flavour, contact us within the return window. Exchanges depend on
          stock availability. Where an exchange is not possible, we will offer a refund for eligible items instead.
        </p>
        <p>
          Price differences for higher-value exchange items must be paid before dispatch. If the replacement is lower
          in price, we refund the difference after inspection.
        </p>
      </LegalSection>

      <LegalSection title="9. Damaged, defective, or incorrect orders">
        <p>
          Inspect parcels when they arrive. Report damage, leaks, or missing items within 48 hours by emailing{" "}
          {LEGAL.email} with photos of the outer packaging, shipping label, and product. We will replace or refund
          qualifying items and may not require return of damaged food that cannot be safely resold.
        </p>
        <p>
          If we sent the wrong SKU or quantity, we will correct the order at no extra charge, including arranging
          collection of the incorrect item where needed.
        </p>
      </LegalSection>

      <LegalSection title="10. Cancellations before dispatch">
        <p>
          If you cancel before packing or handover to courier, we refund the full amount paid. Once dispatched,
          cancellation is not available — please use the returns process if the item is eligible.
        </p>
      </LegalSection>

      <LegalSection title="11. Your statutory rights">
        <p>
          Nothing in this policy reduces your rights under the Consumer Protection Act, 2019 or other applicable Indian
          law. If a product is faulty or not as described, you may have additional remedies regardless of the{" "}
          {LEGAL.returnWindowDays}-day window.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Returns and refunds:{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-accent hover:text-accent-hover">
            {LEGAL.email}
          </a>
        </p>
        <p>
          Related: <LegalLink href="/shipping">Shipping Policy</LegalLink> ·{" "}
          <LegalLink href="/terms">Terms of Service</LegalLink> ·{" "}
          <LegalLink href="/contact">Contact</LegalLink>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
