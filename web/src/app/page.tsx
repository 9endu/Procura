import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ActivePools from "@/components/ActivePools";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#09090b] text-zinc-100 min-h-screen">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <ActivePools />
      <Footer />
    </div>
  );
}
