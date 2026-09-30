import type { Metadata } from "next";

import { BriefingContent } from "@/features/briefing/components/briefing-content";
import { siteDescription } from "@/lib/seo";

import heroImage from "../../../public/daisies.webp";

const title = "Crop Rotation for Java Farmers";
const shareImage = {
  url: "/daisies.webp",
  width: heroImage.width,
  height: heroImage.height,
  alt: "Impressionist oil painting of cream daisies in a field under a teal sky",
};

export const metadata: Metadata = {
  title,
  description: siteDescription,
  alternates: {
    canonical: "/briefing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "One Field",
    title: `${title} | One Field`,
    description: siteDescription,
    url: "/briefing",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | One Field`,
    description: siteDescription,
    images: [shareImage],
  },
};

export default function BriefingPage() {
  return <BriefingContent />;
}
