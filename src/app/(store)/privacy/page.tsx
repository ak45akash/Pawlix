function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">{children}</div>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Pawlix collects account, order and delivery details to fulfil purchases. We do not sell personal data. Payment
        details are handled by Razorpay when that integration is enabled.
      </p>
      <p>Contact hello@pawlix.com to request a copy or deletion of your account data.</p>
    </LegalPage>
  );
}
