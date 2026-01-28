import PublicNav from "@/components/PublicNav";
import { CheckCircle, Zap, Shield, TrendingUp, Package, Clock } from "lucide-react";

export default function PublicHowItWorks() {
  const fundraiserSteps = [
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "1. Register",
      description: "Create your account on Eizer. All new registrations are automatically assigned the Fundraiser role.",
    },
    {
      icon: <Package className="w-8 h-8 text-primary" />,
      title: "2. Receive Machine",
      description: "Administrators will assign a credit card machine to your account. You'll see it in your dashboard with all details.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "3. Accept Payments",
      description: "Use the assigned machine to accept credit card payments from donors during your fundraising activities.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "4. Track Batches",
      description: "Monitor transaction batches and machine status in real-time through your dashboard.",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "5. Submit Redemption",
      description: "When ready, submit a redemption request through the platform specifying the amount and check details.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "6. Receive Funds",
      description: "After admin approval, your check is released and you receive your funds.",
    },
  ];

  const adminSteps = [
    {
      title: "Fundraiser Management",
      description: "Create and manage fundraiser accounts with details like name, contact info, and organization type (foundation/company).",
      details: [
        "Add fundraisers with complete profile information",
        "Track active and inactive fundraisers",
        "Update fundraiser details as needed",
      ],
    },
    {
      title: "Machine Assignment",
      description: "Assign credit card machines to fundraisers and track their status throughout the lending period.",
      details: [
        "Assign available machines to fundraisers",
        "Track machine status (Available, Assigned, Returned, Inactive)",
        "Record batch numbers and locations",
      ],
    },
    {
      title: "Batch Processing",
      description: "Process machine returns and batch data to keep your inventory organized and up-to-date.",
      details: [
        "Record batch numbers and processing dates",
        "Update machine status when returned",
        "Maintain location tracking for all machines",
      ],
    },
    {
      title: "Redemption Processing",
      description: "Review and process fundraiser redemption requests with a transparent status workflow.",
      details: [
        "Review pending redemption requests",
        "Approve or reject requests based on your criteria",
        "Release checks and notify fundraisers",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">How Eizer Works</h1>
          <p className="text-lg text-muted-foreground">
            A step-by-step guide to managing your fundraising operations on our platform.
          </p>
        </div>
      </section>

      {/* Fundraiser Flow */}
      <section className="bg-card border-y border-border py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-foreground">Fundraiser Workflow</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundraiserSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Flow */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-12 text-foreground">Administrator Workflow</h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {adminSteps.map((step, idx) => (
            <div key={idx} className="p-8 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, didx) => (
                  <li key={didx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-card border-y border-border py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Real-Time Tracking</h3>
              <p className="text-muted-foreground">
                Monitor machine status, batch information, and redemption requests in real-time through an intuitive dashboard.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Transparent Status Flow</h3>
              <p className="text-muted-foreground">
                Clear status updates for redemption requests (Pending, Approved, Released, Rejected) keep everyone informed.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Fundraisers and Administrators have dedicated portals with appropriate access levels and functionality.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security ensures your fundraising data and operations are protected at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Reference */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Status Reference</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Machine Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Available</span>
                <span className="text-sm text-muted-foreground">Ready to be assigned</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Assigned</span>
                <span className="text-sm text-muted-foreground">Currently with a fundraiser</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Returned</span>
                <span className="text-sm text-muted-foreground">Returned and processed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">Inactive</span>
                <span className="text-sm text-muted-foreground">No longer in use</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Redemption Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>
                <span className="text-sm text-muted-foreground">Awaiting admin review</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Approved</span>
                <span className="text-sm text-muted-foreground">Approved by admin</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Released</span>
                <span className="text-sm text-muted-foreground">Check has been released</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>
                <span className="text-sm text-muted-foreground">Request was rejected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card border-y border-border py-16 text-center">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Eizer today and streamline your fundraising operations.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
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
