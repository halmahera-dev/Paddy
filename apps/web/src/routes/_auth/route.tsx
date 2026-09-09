import { IceCubesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
});

function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-12">
      <div className="col-span-7 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <span className="flex items-center gap-2 font-medium">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HugeiconsIcon icon={IceCubesIcon} className="size-4" />
            </span>
            Tigris
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative col-span-5 m-4 hidden rounded-4xl bg-muted lg:block">
        <img
          src="/magic.webp"
          alt=""
          className="absolute inset-0 h-full w-full rounded-4xl object-cover object-right dark:brightness-[0.6]"
        />
      </div>
    </div>
  );
}
