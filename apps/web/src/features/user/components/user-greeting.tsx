import { Skeleton } from "@paddy-field/ui/components/skeleton";

import { getSession } from "@/features/user/user-queries";

export async function UserGreeting() {
  const session = await getSession();

  return (
    <h1 className="font-semibold text-lg">
      Welcome back{session?.user.name ? `, ${session.user.name}` : ""}
    </h1>
  );
}

export function UserGreetingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}
