import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
