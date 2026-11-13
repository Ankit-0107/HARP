import { FramedPanel } from "@/components/ui/FramedPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { Reveal } from "@/components/ui/Reveal";

export function PreFooterCta({ heading, button }: { heading: string; button: string }) {
  return (
    <section className="container-x py-6 md:py-10">
      <FramedPanel className="grid min-h-[340px] place-items-center px-6 py-16 text-center md:min-h-[420px]">
        <Reveal className="flex flex-col items-center gap-6">
          <h2 className="max-w-[18ch] text-balance text-[clamp(1.75rem,3vw,2.25rem)] font-light tracking-[-0.04em]">{heading}</h2>
          <PixelButton href="/contact">{button}</PixelButton>
        </Reveal>
      </FramedPanel>
    </section>
  );
}
