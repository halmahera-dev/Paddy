import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { UserGreeting, UserGreetingSkeleton } from "@/features/user/components/user-greeting";

export default function HomePage() {
  return (
    <>
      <PageHeader title="Home" />

      <div className="flex-1 overflow-auto p-4">
        <Suspense fallback={<UserGreetingSkeleton />}>
          <UserGreeting />
        </Suspense>
      </div>
    </>
  );
}
