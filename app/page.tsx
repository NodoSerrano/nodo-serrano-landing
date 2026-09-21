import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import Community from "@/components/sections/community";
import Somos from "@/components/sections/somos";
import Events from "@/components/sections/events";
import ConstruirTitle from "@/components/sections/construir-title";
import Blog from "@/components/sections/blog";
import Sponsors from "@/components/sections/sponsors";
import Newsletter from "@/components/sections/newsletter";
import { ScrollHashManager } from "@/components/scroll-hash-manager";
import { getGhostPosts } from "@/lib/ghost";
import { getLumaStatus } from "@/lib/luma";

export default async function Home() {
  // Fetch the latest post server-side (ISR, revalidate 60 in lib/ghost) so the
  // blog teaser renders with the page instead of a client-side fetch waterfall.
  // Card-only fields — the teaser never renders the post body, and pulling
  // `html` would bloat the HTML document.
  const [{ posts }, luma] = await Promise.all([getGhostPosts({
    limit: 1,
    fields: ["id", "title", "slug", "feature_image", "excerpt", "published_at", "reading_time"],
  }), getLumaStatus()]);
  const latestPost = posts[0] ?? null;

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <ScrollHashManager />
      <main className="flex flex-col">
        {/* Hero Section (incluye el Header nuevo) */}
        <Hero />

        {/* Community Section */}
        <Community />

        {/* About / Somos Section */}
        <Somos />

        {/* Events Section */}
        <Events luma={luma} />

        <ConstruirTitle />

        {/* Blog Section */}
        <Blog post={latestPost} />

        {/* Sponsors Section */}
        <Sponsors />

        {/* Newsletter Section */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
