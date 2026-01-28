import PublicNav from "@/components/PublicNav";
import { Heart, Target, Users } from "lucide-react";

export default function PublicAbout() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Trust & Transparency",
      description: "We believe in building trust through transparent operations and clear communication with all stakeholders.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Operational Excellence",
      description: "Our platform is designed to streamline fundraising operations and maximize efficiency for our users.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community Focused",
      description: "We support fundraisers and organizations in their mission to make a positive impact in their communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">About Eizer</h1>
          <p className="text-lg text-muted-foreground">
            Empowering fundraisers with modern technology to streamline operations and maximize impact.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-card border-y border-border py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Eizer was built to solve a critical problem in the fundraising industry: the complexity of managing credit card machines and processing redemptions. We recognized that fundraisers need a simple, secure, and transparent platform to manage their operations efficiently.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our mission is to empower fundraisers and administrators with elegant tools that reduce operational friction, increase transparency, and enable them to focus on what matters most: supporting their communities.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map((value, idx) => (
            <div key={idx} className="p-8 rounded-lg border border-border hover:border-primary/50 transition-colors text-center">
              <div className="flex justify-center mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Overview */}
      <section className="bg-card border-y border-border py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">The Platform</h2>
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Fundraisers</h3>
              <p>
                Eizer provides fundraisers with a dedicated portal to manage assigned credit card machines, track transaction batches, and submit redemption requests. Our intuitive interface makes it easy to stay organized and informed about your fundraising activities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Administrators</h3>
              <p>
                Administrators benefit from a comprehensive dashboard to manage fundraisers, assign and track credit card machines, process batch returns, and handle redemption requests. Our system is built to support operational efficiency at scale.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Security & Reliability</h3>
              <p>
                Built with enterprise-grade security standards, Eizer ensures that all fundraising operations are protected. Our platform is designed for reliability, scalability, and ease of use across all user roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Join Our Community</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Be part of a platform dedicated to simplifying fundraising operations and supporting organizations in their mission.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Get in Touch
        </a>
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
