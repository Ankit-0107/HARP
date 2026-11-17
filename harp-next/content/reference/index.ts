import type { SiteContent } from "../types";

/**
 * REFERENCE DATASET — verbatim copy from the original Precept (Framer template) export.
 * Not HARP business content. Used only to compare the rebuild against the original.
 * Typo fixes applied (see docs/CONTENT-FIXES.md): "Investor Realtions", "LND@precpet.com", "Recent NEwas", "June, 5 2026".
 * Slides / quotes that were not server-rendered in the export are marked `placeholder: true` (their text is NOT recoverable).
 */
const NOT_IN_EXPORT = "Slide content was not present in the original export (only the first slide was server-rendered).";

export const reference: SiteContent = {
  source: "reference",
  brand: { name: "Precept", wordmark: "Precept", menuLabel: "Precept Industrial", tagline: "Robotics-Driven Manufacturing", url: "https://precept.framer.website", legalLine: "©2026 All Rights Reserved" },
  seo: {
    home: { title: "Precept — Robotics-Driven Manufacturing", description: "Precision manufacturing powered by autonomous robotics. Reliable, high-throughput production at scale, engineered for demanding industries." },
    about: { title: "About — Precept", description: "Meet the team behind Precept and the method that turns robotics into dependable, large-scale manufacturing output." },
    capabilities: { title: "Products — Precept", description: "Explore Precept's manufacturing capabilities, from automated precision machining to high-volume assembly built on robotics." },
    careers: { title: "Careers — Precept", description: "Build the future of robotics-driven manufacturing. Explore open roles and our values at Precept." },
    contact: { title: "Contact — Precept", description: "Get in touch with Precept to discuss robotics-driven manufacturing for your production needs." },
    newsroom: { title: "All — Workshops — Precept", description: "Browse All updates, announcements, and stories from Precept's newsroom." },
    privacy: { title: "Privacy Policy — Precept", description: "Read how Precept collects, uses, and protects your information." },
    notFound: { title: "Page Not Found — Precept", description: "The page you're looking for can't be found. Return to Precept to explore our manufacturing capabilities." },
  },
  nav: {
    links: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Products", href: "/capabilities" },
      { label: "Workshops", href: "/newsroom/filters/completed" }, { label: "Careers", href: "/careers" }, { label: "Contact", href: "/contact" },
    ],
    socials: [
      { label: "Instagram", href: "https://instagram.com", external: true }, { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true }, { label: "X", href: "https://x.com", external: true },
    ],
    cta: { heading: "Let's build it right.", button: "Get in touch" },
    newsletter: { label: "Newsletter", placeholder: "Your email", button: "Sign Up", success: "Thanks — you're on the list." },
  },
  home: {
    hero: {
      lines: ["BUILD", "BETTER"], meta: [
        { label: "Made in:", value: "USA" }, { label: "Facilities:", value: "06" },
        { label: "Deployed:", value: "40+ countries" }, { label: "Operating:", value: "Since 2012" }]
    },
    about: {
      title: "About Us", columns: [
        { heading: "What we are", body: "Precept designs and builds robotics in the U.S. for manufacturing and energy — complete systems engineered in-house, from the parts up to the finished machine." },
        { heading: "Why it matters", body: "Owning the whole stack means our robots fit the work, not the other way around. From a single cell to a full production line, they’re built to adapt as a site grows." }],
      cta: { label: "Learn More", href: "/about" }
    },
    slider: [
      { title: "Precision Machining", body: "Robotic machining and fabrication held to tolerances no manual process can match — cut, formed, and finished in-house.", href: "/capabilities/precision-machining", assetId: "slider-precision-machining" },
      { title: "Slide 2 — not in export", body: NOT_IN_EXPORT, assetId: "capability-robotic-assembly", placeholder: true },
      { title: "Slide 3 — not in export", body: NOT_IN_EXPORT, assetId: "capability-automated-inspection", placeholder: true },
      { title: "Slide 4 — not in export", body: NOT_IN_EXPORT, assetId: "capability-system-integration", placeholder: true },
    ],
    industries: [
      { title: "Aerospace & Defense", body: "Where a fraction of a millimeter decides everything. Precision handling and fabrication for the industry's most unforgiving specs.", assetId: "industry-aerospace-defense" },
      ...[2, 3, 4, 5].map((n, i) => ({
        title: `Industry ${n} — not in export`, body: NOT_IN_EXPORT, placeholder: true,
        assetId: ["home-industries-img-b", "news-automation-fit-line", "capability-automated-inspection", "hero-poster"][i]!
      })),
    ],
    process: {
      label: "Process steps", steps: [
        { title: "Understand", body: "We start on your floor, not in a proposal — learning how you build, where the bottlenecks are, and what \"better\" actually means for your line." },
        { title: "Plan", body: "We map the work to a clear plan: what to automate, what to leave, and the throughput and tolerances the system has to hit." },
        { title: "Build", body: "We engineer and build the robotics around your operation — custom cells, tooling, and controls designed to fit the line you already run." },
        { title: "Integrate", body: "We install and commission alongside your existing equipment, tuning the system to full rate without tearing out what works." },
        { title: "Support", body: "We stay after the line is live — monitoring, training your team, and refining as your production changes." }]
    },
    stats: {
      eyebrow: "stats", title: "By the Numbers", items: [
        { value: 99.6, decimals: 1, suffix: "%", label: "Average line uptime held across deployed automation cells", tag: "RELIABILITY", body: "Robotic cells run shift after shift without the stoppages and rework that come with manual lines — production you can plan around." },
        { value: 3.2, decimals: 1, suffix: "x", label: "Throughput gain over comparable manual production lines", tag: "THROUGHPUT", body: "Robotic cells run continuously at a steady takt — moving more parts per shift than a manual line can sustain, without overtime or burnout." },
        { value: 40, suffix: "M+", label: "Parts produced on Precept automation lines to date", tag: "SCALE", body: "From prototype runs to full-rate production, our lines hold quality as volume climbs — the same standard at any scale." },
        { value: 11, label: "Industries running production on our robotic systems", tag: "REACH", body: "Automotive, aerospace, agriculture, logistics, and energy — one automation backbone proven across the work that matters most." }]
    },
    testimonials: [
      { company: "Axlon", quote: "Every unit comes off the line exactly like the last. We stopped firefighting and got back to building." },
      ...[2, 3, 4].map((n) => ({ company: `Testimonial ${n} — not in export`, quote: NOT_IN_EXPORT, placeholder: true })),
    ],
    clients: { label: "Clients", names: ["client-logo-1", "client-logo-2", "client-logo-3", "client-logo-4"] },
    newsroom: { eyebrow: "Recent Workshops", title: "Workshops" },
  },
  about: {
    header: { eyebrow: "BUILT IN THE U.S.", title: "Built For Tomorrow", body: "We build the robots that run factories and power sites — designed, manufactured, and supported under one roof." },
    timeline: {
      title: "Our Timeline", items: [
        { year: "2017", body: "Precept was founded to build robotics in the U.S. — designing and manufacturing complete systems in-house, not assembling imported parts.", assetId: "timeline-2017" },
        { year: "2020", body: "We opened our first production line and shipped our earliest systems to manufacturing customers.", assetId: "timeline-2020" },
        { year: "2022", body: "Precept brought core components in-house — actuators, controllers, and vision — giving us an integrated supply chain from part to finished robot.", assetId: "timeline-2022" },
        { year: "2024", body: "We scaled to a second facility and moved into energy, deploying systems for inspection and maintenance across power sites.", assetId: "timeline-2024" },
        { year: "Present", body: "Today Precept builds robotics for manufacturing and energy from U.S. facilities, with production capacity growing every quarter.", assetId: "timeline-present" }]
    },
    leadership: {
      eyebrow: "Team", title: "Our Leadership", people: [
        ["Daniel Hartley", "CEO & Director", "team-daniel-hartley"], ["Mara Lindqvist", "COO", "team-mara-lindqvist"], ["Theo Mercer", "CFO", "team-theo-mercer"],
        ["Claire Donovan", "EVP, General Counsel", "team-claire-donovan"], ["Lucas Ferreira", "EVP, Corporate Dev", "team-lucas-ferreira"], ["Grace Chen", "CTO", "team-grace-chen"],
        ["Mateo Reyes", "CCO", "team-mateo-reyes"], ["Sofia Delgado", "SVP, Engineering", "team-sofia-delgado"], ["Henry Caldwell", "SVP, Operations", "team-henry-caldwell"],
        ["Elena Vasquez", "VP, Energy Strategy", "team-elena-vasquez"], ["Jonah Keller", "VP, People & Culture", "team-jonah-keller"], ["Maya Santos", "Head of Sustainability", "team-maya-santos"],
      ].map(([name, role, assetId]) => ({ name: name!, role: role!, assetId: assetId! }))
    },
    locations: {
      eyebrow: "Our Locations", locations: [
        { city: "New York", country: "United States", email: "NYC@precept.com", assetId: "location-new-york" },
        { city: "London", country: "United Kingdom", email: "LND@precept.com", assetId: "location-london" },
        { city: "Los Angeles", country: "United States", email: "LA@precept.com", assetId: "location-los-angeles" },
        { city: "Copenhagen", country: "Denmark", email: "CPH@precept.com", assetId: "location-copenhagen" },
        { city: "Austin", country: "United States", email: "ATX@precept.com", assetId: "location-austin" }]
    },
    contact: {
      eyebrow: "Contact", title: "Contact", body: "Whether it's one cell or a whole floor, start by telling us the problem. We'll bring the plan for how to automate it.",
      channels: [{ label: "General", email: "info@precept.com" }, { label: "Media", email: "media@precept.com" }, { label: "Investor Relations", email: "ir@precept.com" }]
    },
  },
  capabilities: {
    intro: "Precept is an advanced manufacturing company. We machine, assemble, and inspect precision products on robotic lines we run ourselves — automation isn't what we sell, it's how we build. Held to tolerances manual work can't, the same on every shift, onshore.",
    eyebrow: "BUILT IN THE U.S.", title: "Our Products",
    items: [
      { index: "01", tag: "ASSEMBLY", title: "Robotic Assembly", slug: "robotic-assembly", assetId: "capability-robotic-assembly" },
      { index: "02", tag: "INSPECTION", title: "Automated Inspection", slug: "automated-inspection", assetId: "capability-automated-inspection" },
      { index: "03", tag: "MACHINING", title: "Precision Machining", slug: "precision-machining", assetId: "capability-precision-machining" },
      { index: "04", tag: "INTEGRATION", title: "System Integration", slug: "system-integration", assetId: "capability-system-integration" }],
    industries: {
      eyebrow: "What we build", title: "Industries", body: "From automotive lines to aerospace cells, our automation runs in production across the industries where precision and uptime decide the outcome.", list: [
        { name: "Automotive", items: ["Body welding", "Assembly cells", "Part inspection"] }, { name: "Aerospace", items: ["Precision machining", "Composite layup", "Drilling & fastening"] },
        { name: "Energy", items: ["Module assembly", "Cell handling", "Enclosure welding"] }, { name: "Agriculture", items: ["Implement assembly", "Material handling", "Field-unit testing"] },
        { name: "Logistics", items: ["Palletizing", "Sortation", "Case packing"] }, { name: "Electronics", items: ["PCB handling", "Conformal coating", "End-of-line test"] }]
    },
  },
  capabilityDetails: {
    "precision-machining": {
      title: "Precision Machining", status: "published",
      intro: "Precept machines and fabricates parts to tolerances tighter than any manual process can hold — cut, formed, and finished under one roof.",
      overview: "Robotic machining centers cut and form to spec, repeatably, with parts fed in and out unattended. Keeping the work in-house from raw stock to finish means quality is controlled at every step.",
      heading: "We design it, build it, install it, and keep it running",
      services: [
        { title: "CNC & robotic machining", body: "Cut and formed to tight tolerance, repeatably." }, { title: "Forming & fabrication", body: "Bending, shaping, and fabrication from raw stock." },
        { title: "Finishing", body: "Surface finishing and deburring to final spec." }, { title: "In-process metrology", body: "Parts verified against spec while still on the machine." },
        { title: "Tooling management", body: "Tool wear tracked and swapped before quality drifts." }, { title: "In-house, end-to-end", body: "Raw stock to finished part under one roof." }],
      systemsLabel: "One line. Four systems.",
      systems: [
        { title: "CNC machining center", body: "Cuts and forms parts to tight tolerance, repeatably." }, { title: "Robotic load/unload", body: "Feeds parts in and out so the machine runs unattended." },
        { title: "Tool management", body: "Tracks tool wear and swaps before quality drifts." }, { title: "In-process metrology", body: "Verifies each part against spec while it's still on the machine." }],
    },
    ...Object.fromEntries(["Robotic Assembly:robotic-assembly", "Automated Inspection:automated-inspection", "System Integration:system-integration"].map((s) => {
      const [title, slug] = s.split(":") as [string, string];
      return [slug, { title, status: "placeholder" as const, intro: "", overview: "", heading: "", services: [], systemsLabel: "", systems: [] }];
    })),
  },
  careers: {
    eyebrow: "Careers", title: "Build machines that actually run", cta: "See Open Positions",
    body: "We’re a U.S. robotics company building automation from the parts up. If you want to own real hardware end to end, we want to talk.",
    statement: "We hire people who want to build machines that actually run — and stay to see them work on real production floors.",
    values: [
      { index: "01", title: "Own it end to end", body: "Build the whole machine. From first sketch to the production floor, you own real hardware that ships and runs in the field." },
      { index: "02", title: "Built in the U.S.", body: "Design and fabrication under one roof. Short loops between the bench and the line turn ideas into parts in days, not quarters." },
      { index: "03", title: "Hard problems, real stakes", body: "Tolerances measured in microns, uptime measured in shifts. The work is demanding, and it matters the moment it leaves the door." },
      { index: "04", title: "Grow with the systems", body: "Our cells scale from one unit to a full line. Engineers move across disciplines and take on more as the company grows." }],
    teamLine: "One Team.", apply: "apply now", positionsTitle: "Open Positions", positionsCount: 12,
    jobs: ["Robotics Engineer", "Controls Engineer", "Manufacturing Engineer", "Mechanical Design Engineer", "Machine Vision Engineer", "Robotics Software Engineer",
      "Automation Integration Engineer", "Field Service Engineer", "CNC Machinist", "Quality Engineer", "Solutions Engineer", "Technical Writer"]
      .map((title) => ({ title, meta: ["", ""] as [string, string] })), // original rows carried template filler ("Lorem Ipsum") — intentionally not reproduced
  },
  contact: {
    eyebrow: "Contact", title: "Contact", body: "",
    channels: [{ label: "General", email: "info@precept.com" }, { label: "IR", email: "ir@precept.com" }],
    form: { title: "Form", name: "Name", email: "Email", message: "Message", submit: "Join", success: "Thank you — your message has been sent." },
    hq: { label: "HQ", lines: ["1 Bush Terminal,", "Building 21, Brooklyn,", "NY 11232"] },
  },
  newsroom: {
    eyebrow: "Categories", title: "Workshops", categories: ["Completed", "Ongoing", "Upcoming"], latestLabel: "Recent Workshops",
    bodyPlaceholder: "This story has not been written yet. The page layout is in place; the article body is pending.",
    entries: [
      { slug: "automation-should-fit-your-line", title: "Automation Should Fit Your Line, Not Replace It", category: "Completed", date: "2025-08-12", author: "Sarah Collins", heroAssetId: "news-automation-fit-line", authorAssetId: "team-daniel-hartley", status: "published" },
      { slug: "axlon-two-platforms-one-line", title: "How Axlon Brought Two Platforms Onto One Line", category: "Ongoing", date: "2026-03-10", author: "Sarah Collins", heroAssetId: "hero-poster", authorAssetId: "team-mara-lindqvist", status: "published" },
      { slug: "aerix-every-part-inspection", title: "Every-Part Inspection, Built Into the Line at Aerix", category: "Upcoming", date: "2026-02-18", author: "David Reyes", heroAssetId: "capability-automated-inspection", authorAssetId: "article-author-photo-aerix", status: "published" },
      { slug: "cargon-automated-floor-peak", title: "How Cargon Automated Its Floor Before Peak Season", category: "Completed", date: "2026-01-22", heroAssetId: "news-card-cargon", status: "placeholder" },
      { slug: "voltan-robotic-field-inspection", title: "Taking People Off the Turbine at Voltan", category: "Ongoing", date: "2025-12-05", heroAssetId: "news-card-voltan", status: "placeholder" },
      { slug: "why-we-build-our-own-lines", title: "Why We Build Our Own Lines", category: "Upcoming", date: "2025-11-14", heroAssetId: "timeline-2017", status: "placeholder" },
      { slug: "reshoring-only-works-if-you-automate", title: "Reshoring Only Works If You Automate", category: "Completed", date: "2025-10-09", heroAssetId: "news-card-reshoring", status: "placeholder" },
      { slug: "repeatable-to-the-millimeter", title: "What \"Repeatable to the Millimeter\" Actually Means", category: "Ongoing", date: "2025-09-03", heroAssetId: "timeline-2024", status: "placeholder" },
    ],
  },
  privacy: {
    title: "Privacy Policy", status: "published", updated: "2026-06-05", paragraphs: [
      "Precept is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal data when you use our website and services.",
      "We collect personal data, such as name, email address, phone number, and other contact information. We also collect technical data, including IP address, browser type, device type, and operating system. Additionally, we collect usage data, which provides information about your use of our website and services.",
      "We collect this information directly from you through forms, surveys, and other interactions. We also collect information automatically through cookies, analytics tools, and other technologies.",
      "We use the collected information to provide and improve our services, respond to your inquiries and requests, and send you marketing communications if you've opted in. We also use this information to comply with laws and regulations.",
      "We disclose your information to third-party service providers for services like payment processing and data analysis. We may also disclose your information to partners for joint marketing initiatives and other collaborations. Additionally, we may disclose your information to authorities to comply with laws and regulations.",
      "We implement reasonable security measures to protect your personal data. However, no security measures are foolproof, and we can't guarantee the security of your data.",
      "You have the right to request access to your personal data, request corrections to your personal data, request deletion of your personal data, and opt out of marketing communications.",
      "We reserve the right to modify this Privacy Policy at any time. Your continued use of our website and services after changes are made constitutes your acceptance of the revised policy.",
      "If you have any questions or concerns about this Privacy Policy, please contact us."]
  },
  notFound: { code: "404", title: "Page not found", body: "The page you are looking for was not found or relocated.", cta: "Back to home" },
};
