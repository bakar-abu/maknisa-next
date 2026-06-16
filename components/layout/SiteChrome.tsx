import { AffixBar } from "./AffixBar";
import { BodyRouteClasses } from "./BodyRouteClasses";
import { Footer } from "./Footer";
import { FloatingContactWidget } from "./FloatingContactWidget";
import { Header } from "./Header";
import { HeaderScrollEffects } from "./HeaderScrollEffects";
import { SkipLinks } from "./SkipLinks";
import { UserWayWidget } from "./UserWayWidget";
import { SvgSprites } from "@/components/icons/SvgSprites";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BodyRouteClasses />
      <HeaderScrollEffects />
      <SkipLinks />
      <Header />
      <AffixBar />
      {children}
      <Footer />
      <FloatingContactWidget />
      <SvgSprites />
      <UserWayWidget />
    </>
  );
}
