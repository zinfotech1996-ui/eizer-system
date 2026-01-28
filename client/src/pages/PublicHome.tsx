import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import { getLoginUrl } from "@/const";
import PublicNav from "@/components/PublicNav";

export default function PublicHome() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const steps = [
    {
      number: "1",
      title: "Register as Fundraiser",
      description: "Create your account and join our platform to start fundraising",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      number: "2",
      title: "Receive Credit Card Machine",
      description: "Get assigned a credit card machine for your fundraising activities",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      number: "3",
      title: "Process Transactions",
      description: "Use the machine to accept credit card payments from donors",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      number: "4",
      title: "Request Redemption",
      description: "Submit a redemption request to receive your funds via check",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const features = [
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security to protect your fundraising operations",
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface designed for fundraisers of all technical levels",
    },
    {
      title: "Fast Processing",
      description: "Quick redemption requests and check processing",
    },
    {
      title: "Transparent Tracking",
      description: "Real-time visibility into your machines and redemption status",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Simplify Your <span className="text-primary">Fundraising</span> Operations
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Eizer is a modern, secure platform for managing credit card machine lending and redemption processing. Streamline your fundraising workflow with elegant tools designed for efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/fundraiser")}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/auth")}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Get Started <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => navigate("/how-it-works")}
                    className="px-8 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
                  >
                    Learn More
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <p className="text-muted-foreground">Secure & Efficient Fundraising</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Eizer */}
      <section className="bg-card border-y border-border py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What is Eizer?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">For Fundraisers</h3>
              <p className="text-muted-foreground">
                Eizer provides a streamlined platform to manage assigned credit card machines, track transaction batches, and request redemptions with transparent status updates.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">For Administrators</h3>
              <p className="text-muted-foreground">
                Manage fundraisers, assign machines, process batch returns, and handle redemption requests with a powerful admin dashboard designed for operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {step.number}
                </div>
                <div className="flex-1 h-px bg-border hidden lg:block"></div>
              </div>
              <div className="text-primary mb-2">{step.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Eizer?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join Eizer today and streamline your fundraising operations with our modern, secure platform.
        </p>
        {!isAuthenticated && (
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Now
          </a>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Eizer</h4>
              <p className="text-sm text-muted-foreground">Modern fundraising management platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/")} className="hover:text-foreground">Home</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-foreground">About</button></li>
                <li><button onClick={() => navigate("/how-it-works")} className="hover:text-foreground">How It Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/support")} className="hover:text-foreground">FAQ</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-foreground">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Eizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
