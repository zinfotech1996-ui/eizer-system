import PublicNav from "@/components/PublicNav";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PublicSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Eizer?",
      answer: "Eizer is a web-based platform designed to simplify fundraising operations by managing credit card machine lending and redemption processing. It provides separate portals for fundraisers and administrators with role-based access and transparent workflows.",
    },
    {
      question: "How do I register as a fundraiser?",
      answer: "Simply click the 'Get Started' button on the homepage and complete the registration form. All new registrations are automatically assigned the Fundraiser role. You'll receive confirmation and can then log in to your fundraiser dashboard.",
    },
    {
      question: "Can I create an admin account?",
      answer: "No, admin accounts cannot be created through public registration. Admin accounts are created internally by the system administrator only. If you need admin access, please contact our support team.",
    },
    {
      question: "How do I request a credit card machine?",
      answer: "As a fundraiser, you cannot directly request a machine. Administrators assign machines to fundraisers based on their needs. Once assigned, you'll see the machine in your dashboard with all relevant details.",
    },
    {
      question: "What is a batch number?",
      answer: "A batch number is a unique identifier assigned to a group of transactions processed on a credit card machine. It helps track and organize transaction data for accounting and reconciliation purposes.",
    },
    {
      question: "How do I submit a redemption request?",
      answer: "Log in to your fundraiser dashboard, navigate to 'Request Redemption', enter the amount and optional notes, and submit. Your request will be marked as 'Pending' and an administrator will review it.",
    },
    {
      question: "What are the possible statuses for a redemption request?",
      answer: "Redemption requests have four possible statuses: Pending (awaiting admin review), Approved (admin has approved), Released (check has been issued), and Rejected (request was denied).",
    },
    {
      question: "How long does it take to process a redemption request?",
      answer: "Processing times vary based on your organization's procedures. You can track the status of your requests in real-time through your dashboard. Contact your administrator for specific timelines.",
    },
    {
      question: "Can I edit a redemption request after submitting it?",
      answer: "Once submitted, redemption requests cannot be edited. If you need to make changes, contact your administrator who may be able to reject and allow you to resubmit.",
    },
    {
      question: "What information do I need to provide for a redemption request?",
      answer: "You'll need to provide the amount, and optionally the check number, check name, and memo/notes. The system will automatically record the submission date and link it to your account.",
    },
    {
      question: "Is my data secure on Eizer?",
      answer: "Yes, Eizer is built with enterprise-grade security standards. All data is encrypted, and access is controlled through role-based permissions. We take data security seriously.",
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through the Contact Us page. Fill out the form with your inquiry and we'll get back to you as soon as possible.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Support & FAQ</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Eizer and how to use our platform.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-card border-y border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Quick Help</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl">
            <a
              href="/how-it-works"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
              <p className="text-sm text-muted-foreground">Learn the step-by-step process</p>
            </a>
            <a
              href="/about"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">About Eizer</h3>
              <p className="text-sm text-muted-foreground">Understand our mission and values</p>
            </a>
            <a
              href="/contact"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Get in touch with our team</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-12 text-foreground">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors text-left"
              >
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform flex-shrink-0 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-6 bg-background border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-card border-y border-border py-16 text-center">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Eizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
