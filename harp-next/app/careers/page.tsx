import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { ScrollStatement } from "@/components/sections/careers/ScrollStatement";
import { CareersHeader, Values, GalleryTicker, Positions } from "@/components/sections/careers/CareersSections";

export const metadata = pageMetadata("careers", "/careers");

export default function CareersPage() {
  const c = getContent(); const k = c.careers;
  return (
    <>
      <CareersHeader c={k} />
      <ScrollStatement text={k.statement} />
      <Values c={k} />
      <GalleryTicker line={k.teamLine} />
      <Positions c={k} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
