import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}