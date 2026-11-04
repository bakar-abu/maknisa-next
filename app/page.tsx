import type { Metadata } from "next";
import { HeroIntro } from "@/components/home/HeroIntro";
import { HomeClientSections } from "@/components/home/HomeClientSections";
import { IntroTextSection } from "@/components/home/IntroTextSection";
import { fetchPublicHomePageContent } from "@/lib/cms/fetch-home-page";
import {
  asActionsSiteContent,
  asBespokeTextContent,
  asDesignColumnsContent,
  asEnvironmentVideoContent,
  asHeroContent,
  asIntroTextContent,
  asMagazineContent,
  asNewsScrollingContent,
  asVideoSlidersContent,
  asLaunchBoxesContent,
} from "@/lib/cms/home-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublicHomePageContent();
  const robots = {
    index: !page.seo.noIndex,
    follow: !page.seo.noFollow,
  };

  return {
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    robots,
  };
}

export default async function HomePage() {
  const page = await fetchPublicHomePageContent();

  return (
    <>
      <main id="main-content" role="main">
        <HeroIntro content={asHeroContent(page.sections["hero-intro"])} />
        <IntroTextSection content={asIntroTextContent(page.sections["intro-text"])} />
        <HomeClientSections
          bespokeContent={asBespokeTextContent(page.sections["bespoke-text"])}
          videoSlidersContent={asVideoSlidersContent(page.sections["video-sliders"])}
          launchBoxesContent={asLaunchBoxesContent(page.sections["launch-boxes"])}
          designColumnsContent={asDesignColumnsContent(page.sections["design-columns"])}
          newsScrollingContent={asNewsScrollingContent(page.sections["news-scrolling"])}
          environmentVideoContent={asEnvironmentVideoContent(
            page.sections["environment-video"],
          )}
          actionsSiteContent={asActionsSiteContent(page.sections["actions-site"])}
          magazineContent={asMagazineContent(page.sections["magazine"])}
        />
      </main>
    </>
  );
}
