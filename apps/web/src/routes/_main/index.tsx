import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <>
      <PageHeader title="Home" />
      <div className="flex-1 overflow-auto p-4">
        <h1 className="font-semibold text-lg">
          Welcome back{session?.user.name ? `, ${session.user.name}` : ""}
        </h1>
      </div>
    </>
  );
}
