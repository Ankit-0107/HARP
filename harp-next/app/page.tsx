import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { BootCurtain } from "@/components/layout/BootCurtain";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { Hero } from "@/components/sections/home/Hero";
import { AboutIntro } from "@/components/sections/home/AboutIntro";
import { ProductSlider } from "@/components/sections/home/ProductSlider";
import { CapableIndustries } from "@/components/sections/home/CapableIndustries";
import { ProcessOrbit } from "@/components/sections/home/ProcessOrbit";
import { Stats } from "@/components/sections/home/Stats";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { ClientsTicker } from "@/components/sections/home/ClientsTicker";
import { NewsroomPreview } from "@/components/sections/home/NewsroomPreview";

export const metadata = pageMetadata("home", "/");

export default function HomePage() {
  const c = getContent();
  const h = c.home;
  return (
    <>
      <BootCurtain />
      <Hero c={h.hero} />
      <AboutIntro c={h.about} />
      <ProductSlider slides={h.slider} />
      <CapableIndustries slides={h.industries} />
      <ProcessOrbit steps={h.process.steps} label={h.process.label} />
      <Stats c={h.stats} />
      <Testimonials items={h.testimonials} />
      <ClientsTicker label={h.clients.label} names={h.clients.names} />
      <NewsroomPreview eyebrow={h.newsroom.eyebrow} title={h.newsroom.title} entries={c.newsroom.entries} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
