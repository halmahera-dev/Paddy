import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="Blog" />

      <div className="px-4">
        <article className="typeset mx-auto max-w-2xl py-8">
          <p className="text-muted-foreground text-sm">
            <time dateTime="2026-09-09">September 9, 2026</time> · 4 min read
          </p>
          <h1>Rendering philosophy, one boundary at a time</h1>
          <p>
            The App Router pushes you toward a single question on every page:{" "}
            <em>what can paint now, and what has to wait?</em> Answer it well and the app feels
            instant even when the data behind it is slow.
          </p>

          <h2>Pages compose, they don&apos;t fetch</h2>
          <p>
            A page is a layout of <code>&lt;Suspense&gt;</code> boundaries and static chrome. The
            reads live in feature components that suspend on their own data, so the shell streams
            first and each section fills in independently.
          </p>
          <blockquote>
            <p>
              If a page starts with <code>await</code> at the top, the whole route waits on the
              slowest thing in it.
            </p>
          </blockquote>

          <h2>A checklist</h2>
          <ul>
            <li>
              Keep pages synchronous — resolve params with <code>.then()</code>.
            </li>
            <li>
              Feature components take IDs, not <code>params</code>.
            </li>
            <li>The page owns the boundary; the feature owns the skeleton.</li>
            <li>
              Stable wrappers stay outside <code>&lt;Suspense&gt;</code> so nothing jumps.
            </li>
          </ul>

          <h2>What a feature read looks like</h2>
          <pre>
            <code>{`import "server-only";
import { cache } from "react";

export const getPost = cache(async (slug: string) => {
  const post = await db.post.findBySlug(slug);
  if (!post) notFound();
  return post;
});`}</code>
          </pre>
          <p>
            Wrap it in <code>cache()</code> so two components on the same page asking for the same
            post hit the database once. Under Cache Components, reach for{" "}
            <code>&apos;use cache&apos;</code> and a <code>cacheTag</code> instead.
          </p>

          <hr />
          <p className="text-muted-foreground text-sm">
            Written for the Paddy Field dashboard as a typeset demo.
          </p>
        </article>
      </div>
    </div>
  );
}
