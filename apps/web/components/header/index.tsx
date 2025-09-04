import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Toolbar } from "./toolbar";
import { FileBreadcrumb } from "./file-breadcrumb";

export function AppHeader() {
  return (
    <header className="bg-background sticky top-0 flex flex-col border-b">
      <div className="flex shrink-0 items-center gap-2 p-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <FileBreadcrumb />
        <Toolbar className="ml-auto" />
      </div>
    </header>
  )
}