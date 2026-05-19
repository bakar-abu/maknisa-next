import { HeroIntro } from "@/components/home/HeroIntro";
import { IntroTextSection } from "@/components/home/IntroTextSection";
import { HomeClientSections } from "@/components/home/HomeClientSections";

export default function HomePage() {
  return (
    <>
      <main id="main-content" role="main">
        <HeroIntro />
        <IntroTextSection />
        <HomeClientSections />
      </main>
    </>
  );
}
