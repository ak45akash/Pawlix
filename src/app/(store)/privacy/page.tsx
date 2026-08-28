import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalLink, LegalList, LegalPage, LegalSection, LEGAL } from "@/components/store/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pawlix collects, uses, and protects your personal information when you shop for pet products online or in-store across the Tricity.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description={`This policy explains what personal data ${LEGAL.brand} collects when you use ${LEGAL.domain}, place an order, or visit our store in ${siteConfig.location.storeCity}, and how we use and protect it.`}
      lastUpdated={LEGAL.lastUpdated}
    >
      <LegalSection title="1. Who we are">
        <p>
          {LEGAL.brand} ({LEGAL.domain}) is a pet retail business serving customers in{" "}
          {siteConfig.location.formatted} and online across India where delivery is available. For privacy-related
          enquiries, contact{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-accent hover:text-accent-hover">
            {LEGAL.email}
          </a>
          .
        </p>
        <p>
          We respect your privacy. We collect only what we need to run the shop, fulfil orders, and improve your
          experience. We do not sell your personal data to third-party marketers.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>Depending on how you interact with us, we may collect:</p>
        <LegalList
          items={[
            "Identity and contact details — name, email address, phone number, delivery address.",
            "Account information — login credentials if you create an account, order history, and saved preferences.",
            "Order and transaction data — products purchased, amounts paid, payment status, invoices, and delivery records.",
            "Communications — messages you send via our contact form, email, or in-store enquiries.",
            "Technical data — IP address, browser type, device information, and pages visited when you use the website.",
            "Reviews — name or display name, rating, and review text if you submit product feedback.",
          ]}
        />
        <p>
          Payment card details are entered on secure pages operated by our payment processor (e.g. Razorpay). We receive
          confirmation of payment and limited card metadata (such as last four digits) but not your full card number.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <p>We use personal data to:</p>
        <LegalList
          items={[
            "Process, fulfil, and deliver orders across the Tricity and other serviceable areas.",
            "Send order confirmations, shipping updates, and responses to your enquiries.",
            "Manage returns, refunds, and customer support.",
            "Operate accounts and show your order history.",
            "Improve our website, catalogue, and inventory planning.",
            "Comply with tax, accounting, and legal obligations (including GST records where applicable).",
            "Prevent fraud, abuse, and security incidents.",
            "Send marketing emails only where you have opted in — you may unsubscribe at any time.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Legal basis">
        <p>
          We process personal data where necessary to perform a contract with you (fulfilling an order), where required
          by law (tax and record-keeping), where you have given consent (e.g. marketing emails), or where we have a
          legitimate interest that is not overridden by your rights (e.g. improving site security and preventing fraud).
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing with third parties">
        <p>We share data only when needed to operate the business:</p>
        <LegalList
          items={[
            "Payment processors — to authorise and settle transactions securely.",
            "Courier and logistics partners — to deliver orders to your address.",
            "Technology providers — hosting, email delivery, and analytics tools bound by confidentiality obligations.",
            "Professional advisers — accountants or lawyers when required for compliance or dispute resolution.",
            "Authorities — when required by law, court order, or to protect our legal rights.",
          ]}
        />
        <p>We do not sell, rent, or trade your personal information to unrelated third parties for their marketing.</p>
      </LegalSection>

      <LegalSection title="6. Cookies and similar technologies">
        <p>
          Our website may use cookies and local storage to keep you signed in, remember cart contents, and understand
          how pages are used. Essential cookies are required for checkout and account features. You can control
          non-essential cookies through your browser settings; disabling them may limit some functionality.
        </p>
        <p>
          Demo and development environments may store catalogue data locally in your browser until a production
          database is connected. That data stays on your device unless you clear site storage.
        </p>
      </LegalSection>

      <LegalSection title="7. Data retention">
        <p>
          We keep order and invoice records for as long as required for tax, accounting, and legal purposes — typically
          at least seven years for financial records under Indian law. Account data is retained while your account is
          active and for a reasonable period afterward unless you request deletion, subject to legal hold requirements.
        </p>
        <p>Marketing preferences and unsubscribes are honoured promptly and retained to prevent re-contact.</p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          We use reasonable technical and organisational measures to protect personal data, including HTTPS on the
          website, access controls on admin systems, and reputable payment partners for card processing. No method of
          transmission over the internet is completely secure; please use a strong password and keep login details
          private.
        </p>
      </LegalSection>

      <LegalSection title="9. Your rights">
        <p>You may request to:</p>
        <LegalList
          items={[
            "Access a copy of personal data we hold about you.",
            "Correct inaccurate or incomplete information.",
            "Delete account data where we are not legally required to retain it.",
            "Withdraw consent for marketing communications.",
            "Raise a concern with us before approaching a regulator.",
          ]}
        />
        <p>
          To exercise these rights, email {LEGAL.email} from the address associated with your account or order. We may
          ask for verification before releasing or changing data. We aim to respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          {LEGAL.domain} is intended for adults purchasing on behalf of themselves or their household. We do not
          knowingly collect personal data from children under 18 without parental consent. If you believe a child has
          provided us data, contact us and we will delete it where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="11. International transfers">
        <p>
          Our primary operations and data storage are in India. If we use service providers outside India in the
          future, we will ensure appropriate safeguards consistent with applicable law.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. The &quot;Last
          updated&quot; date at the top will change when we do. Material changes may be highlighted on the website or
          communicated by email where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Privacy enquiries:{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-accent hover:text-accent-hover">
            {LEGAL.email}
          </a>
        </p>
        <p>
          See also: <LegalLink href="/terms">Terms of Service</LegalLink> ·{" "}
          <LegalLink href="/returns">Returns &amp; Refunds</LegalLink> ·{" "}
          <LegalLink href="/contact">Contact</LegalLink>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
