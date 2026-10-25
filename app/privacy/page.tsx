"use client";

import PageLayout from "../components/PageLayout";

export default function PrivacyPolicy() {
  const lastUpdated = "March 15, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "When you join our waitlist, we collect your email address. We may also collect technical information such as your IP address, browser type, and usage patterns while interacting with our website. This data helps us improve your experience and communicate updates effectively.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "Your email is primarily used to notify you about progress, early access opportunities, and the official launch of Turfin App. We also use aggregated usage data to optimize website performance and understand user interests within the sports technology space.",
    },
    {
      title: "3. Data Sharing and Protection",
      content:
        "Turfin App, operated by RE Orbit Innovations Pvt Ltd, does not sell, trade, or rent your personal information to third parties. We use industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access. We only share information with trusted service providers who assist in our operations (e.g., email delivery services).",
    },
    {
      title: "4. Your Privacy Rights",
      content:
        "You have the right to access, update, or request the deletion of your personal data at any time. If you wish to be removed from our waitlist or have any concerns about your data, please contact us at privacy@turfinapp.com.",
    },
    {
      title: "5. Cookies and Tracking",
      content:
        "We may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic. You can choose to disable cookies through your browser settings, though some site features may depend on them.",
    },
    {
      title: "6. Changes to This Policy",
      content:
        "We may update our Privacy Policy as Turfin App evolves. Any significant changes will be reflected on this page with an updated 'Last Updated' date. We encourage you to review this policy periodically.",
    },
  ];

  return (
    <PageLayout>
      <div className="rounded-[32px] md:rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-16 text-white shadow-2xl premium-glow mb-20">
        <header className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Privacy <span className="text-[#CCFF00]">Policy.</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base uppercase tracking-widest font-semibold italic">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <section key={index} className="group">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#CCFF00]/90 group-hover:text-[#CCFF00] transition-colors">
                {section.title}
              </h2>
              <p className="text-white/60 leading-relaxed md:text-lg">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm text-center italic">
            By using our services, you agree to these terms. If you have
            questions, reach out to us at{" "}
            <a
              href="mailto:contact@turfinapp.com"
              className="text-[#CCFF00] hover:underline"
            >
              contact@turfinapp.com
            </a>
            .
          </p>
        </footer>
      </div>
    </PageLayout>
  );
}
