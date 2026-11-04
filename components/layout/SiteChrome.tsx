import { AffixBar } from "./AffixBar";
import { BodyRouteClasses } from "./BodyRouteClasses";
import { Footer } from "./Footer";
import { FloatingContactWidget } from "./FloatingContactWidget";
import { Header } from "./Header";
import { HeaderScrollEffects } from "./HeaderScrollEffects";
import { SkipLinks } from "./SkipLinks";
import { UserWayWidget } from "./UserWayWidget";
import { CartProvider } from "@/components/cart/CartProvider";
import { SvgSprites } from "@/components/icons/SvgSprites";

import "@/app/styles/cart.css";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
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
    </CartProvider>
  );
}
