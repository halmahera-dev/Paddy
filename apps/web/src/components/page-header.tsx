import { SidebarTrigger } from "@tigris/ui/components/sidebar";
import { cn } from "@tigris/ui/lib/utils";

function PageHeader({
  className,
  title,
  children,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  title?: React.ReactNode;
}) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "sticky top-0 z-10 flex shrink-0 items-center gap-2 border-border/50 border-b bg-background/80 px-4 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/60",
        className,
      )}
      {...props}
    >
      <SidebarTrigger />

      {title === undefined ? null : (
        // Keyed so a title that arrives late (Mastra generates thread titles
        // asynchronously) remounts and fades in rather than teleporting.
        <span
          key={typeof title === "string" ? title : undefined}
          className="truncate font-medium text-sm opacity-100 starting:opacity-0 transition-opacity duration-200 ease-out motion-reduce:duration-0"
        >
          {title}
        </span>
      )}

      {children}
    </header>
  );
}

export { PageHeader };
