import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalLink, LegalList, LegalPage, LegalSection, LEGAL } from "@/components/store/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for ordering pet food, toys and accessories on pawlix.com — pricing, payment, delivery across the Tricity, and your rights as a customer.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description={`These terms govern your use of ${LEGAL.domain} and purchases from ${LEGAL.brand}, including online orders and in-store sales across ${siteConfig.location.formatted}.`}
      lastUpdated={LEGAL.lastUpdated}
    >
      <LegalSection title="1. Agreement">
        <p>
          By accessing {LEGAL.domain}, creating an account, or placing an order, you agree to these Terms of Service
          (&quot;Terms&quot;), our{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink>,{" "}
          <LegalLink href="/shipping">Shipping Policy</LegalLink>, and{" "}
          <LegalLink href="/returns">Returns &amp; Refunds Policy</LegalLink>.
        </p>
        <p>
          If you do not agree, please do not use the website or complete a purchase. We may update these Terms from time
          to time. The version in effect when you place an order applies to that order.
        </p>
      </LegalSection>

      <LegalSection title="2. About Pawlix">
        <p>
          {LEGAL.brand} operates a pet retail business selling food, toys, accessories, and related products for dogs,
          cats, and birds. We serve customers online at {LEGAL.domain} and at our counter in{" "}
          {siteConfig.location.storeCity}. Online inventory and in-store stock are intended to reflect the same
          availability, though occasional timing differences may occur during high demand.
        </p>
        <p>
          References to &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; mean {LEGAL.brand}. References to
          &quot;you&quot; mean the person placing an order or using the website.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and accounts">
        <p>
          You must be at least 18 years old, or placing an order with the consent of a parent or legal guardian, to
          purchase on {LEGAL.domain}. You are responsible for keeping your account credentials confidential and for all
          activity under your account.
        </p>
        <p>
          Information you provide at checkout must be accurate — especially name, email, phone, and delivery address.
          Incorrect details may delay fulfilment or prevent delivery within the Tricity service area.
        </p>
      </LegalSection>

      <LegalSection title="4. Products, pricing, and availability">
        <p>
          Product descriptions, photographs, ingredients, sizing, and prices are shown in good faith. We work to keep
          listings accurate, but minor variations in packaging, batch labels, or manufacturer updates may occur without
          notice.
        </p>
        <p>
          All prices are listed in Indian Rupees (INR) and, unless stated otherwise, are inclusive of applicable GST
          where charged at checkout. Promotional prices, coupons, and discounts apply only as described at the time of
          offer and cannot be combined unless explicitly allowed.
        </p>
        <p>
          Placing an order constitutes an offer to buy. We confirm acceptance when we send an order confirmation or
          begin processing. We may cancel an order before dispatch if a product is unavailable, a pricing error is
          identified, or we suspect fraud — in which case any amount paid will be refunded.
        </p>
      </LegalSection>

      <LegalSection title="5. Orders and payment">
        <p>
          Online orders may be paid through the payment methods offered at checkout. Payment processing is handled by
          our payment partner (Razorpay or another PCI-compliant provider we enable). We do not store full card numbers
          on our servers.
        </p>
        <p>
          An order is not complete until payment is successfully authorised (or, for eligible offline/counter sales,
          payment is received in full). You will receive an order reference by email when an online order is recorded.
        </p>
        <p>
          We reserve the right to refuse or limit quantities on any order, including to prevent reselling or to protect
          stock for regular customers.
        </p>
      </LegalSection>

      <LegalSection title="6. Shipping and delivery">
        <p>
          Delivery terms, charges, and timelines are set out in our{" "}
          <LegalLink href="/shipping">Shipping Policy</LegalLink>. Currently we deliver primarily across{" "}
          {siteConfig.location.formatted}. Standard shipping is ₹{LEGAL.shippingCharge}; orders above ₹
          {LEGAL.freeShippingThreshold} qualify for free shipping unless a promotion states otherwise.
        </p>
        <p>
          Risk of loss passes to you upon delivery to the address provided or upon successful handover to a courier.
          Please inspect parcels on arrival and report damage or missing items promptly as described in our Returns
          policy.
        </p>
      </LegalSection>

      <LegalSection title="7. Store pickup and offline sales">
        <p>
          Products purchased at our {siteConfig.location.storeCity} counter are subject to these Terms where applicable,
          except that delivery clauses do not apply. Receipts and order records for offline sales are maintained for
          stock and accounting purposes.
        </p>
        <p>
          Online order pickup at the counter is available when offered at checkout. You may be asked to show the order
          confirmation and a valid ID.
        </p>
      </LegalSection>

      <LegalSection title="8. Cancellations">
        <p>
          You may request cancellation before an order is packed or dispatched by writing to {LEGAL.email} with your
          order number. Once an order has shipped, cancellation is not guaranteed; you may instead follow our returns
          process if eligible.
        </p>
        <p>
          We may cancel orders that cannot be fulfilled, including due to stock discrepancies or events outside our
          reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="9. Returns and refunds">
        <p>
          Returns, exchanges, and refunds are governed by our{" "}
          <LegalLink href="/returns">Returns &amp; Refunds Policy</LegalLink>. In summary, unused and unopened items in
          resalable condition may be returned within {LEGAL.returnWindowDays} days of delivery, subject to exclusions for
          opened food and certain hygiene products.
        </p>
        <p>
          Nothing in these Terms limits your statutory rights under applicable Indian consumer protection law where
          those rights apply.
        </p>
      </LegalSection>

      <LegalSection title="10. Product use and advice">
        <p>
          Content on {LEGAL.domain} — including journal posts, recipes, and product descriptions — is for general
          information only. It is not veterinary advice. Consult a qualified veterinarian before changing your
          pet&apos;s diet, especially if your pet has allergies, chronic illness, or is pregnant or nursing.
        </p>
        <p>
          You are responsible for using products as labelled and for supervising pets with toys, chews, and accessories
          appropriate to their size and behaviour.
        </p>
      </LegalSection>

      <LegalSection title="11. Reviews and user content">
        <p>
          If you submit a product review or other content, you grant {LEGAL.brand} a non-exclusive licence to display,
          reproduce, and adapt that content on {LEGAL.domain} and marketing materials. You confirm the content is
          honest, relates to a genuine purchase or experience, and does not infringe third-party rights or contain
          unlawful material.
        </p>
        <p>We may remove content that is abusive, misleading, or off-topic.</p>
      </LegalSection>

      <LegalSection title="12. Intellectual property">
        <p>
          The {LEGAL.brand} name, logo, website design, photography, and original text are owned by or licensed to us.
          You may not copy, scrape, or reuse them for commercial purposes without written permission. Product trademarks
          belong to their respective brands.
        </p>
      </LegalSection>

      <LegalSection title="13. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {LEGAL.brand} is not liable for indirect, incidental, or consequential
          losses arising from use of the website or products, including loss of profit or data. Our total liability for
          any claim relating to a specific order is limited to the amount you paid for that order.
        </p>
        <p>
          We do not warrant that the website will be uninterrupted or error-free. We are not responsible for courier
          delays outside our reasonable control once goods are handed to the carrier.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing law and disputes">
        <p>
          These Terms are governed by the laws of India. Courts at Chandigarh shall have exclusive jurisdiction for
          disputes, subject to any mandatory consumer forum jurisdiction that applies to you under the Consumer
          Protection Act, 2019.
        </p>
        <p>
          We prefer to resolve concerns informally first — please contact {LEGAL.email} with your order number and a
          clear description of the issue.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-accent hover:text-accent-hover">
            {LEGAL.email}
          </a>
        </p>
        <p>
          Related policies:{" "}
          <LegalLink href="/privacy">Privacy</LegalLink> · <LegalLink href="/shipping">Shipping</LegalLink> ·{" "}
          <LegalLink href="/returns">Returns</LegalLink> · <LegalLink href="/contact">Contact</LegalLink>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
