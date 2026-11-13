import { compileMDX } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";

const components = {
  h2: (p: ComponentProps<"h2">) => <h2 className="mb-3 mt-12 text-[clamp(1.4rem,2vw,1.75rem)] font-light tracking-[-0.04em]" {...p} />,
  h3: (p: ComponentProps<"h3">) => <h3 className="mb-2 mt-8 text-[18px] font-medium tracking-[-0.02em]" {...p} />,
  p: (p: ComponentProps<"p">) => <p className="mb-5 max-w-[62ch] text-[16px] leading-[1.6] text-[#333]" {...p} />,
  ul: (p: ComponentProps<"ul">) => <ul className="mb-5 max-w-[62ch] list-disc space-y-1.5 pl-5 text-[16px] leading-[1.6] text-[#333]" {...p} />,
  ol: (p: ComponentProps<"ol">) => <ol className="mb-5 max-w-[62ch] list-decimal space-y-1.5 pl-5 text-[16px] leading-[1.6] text-[#333]" {...p} />,
  blockquote: (p: ComponentProps<"blockquote">) => <blockquote className="my-8 max-w-[56ch] border-l-2 border-ink pl-5 text-[20px] font-light leading-[1.35] tracking-[-0.02em]" {...p} />,
  a: (p: ComponentProps<"a">) => <a className="underline underline-offset-4 hover:opacity-60" {...p} />,
};

/** MDX is authored in-repo (content/newsroom/<source>/*.mdx) — never render untrusted user input through this. */
export async function ArticleBody({ source }: { source: string }) {
  const { content } = await compileMDX({ source, components });
  return <div>{content}</div>;
}
