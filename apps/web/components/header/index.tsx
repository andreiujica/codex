import { Breadcrumb, BreadcrumbList } from "@workspace/ui/components/breadcrumb";
import { BreadcrumbItem } from "@workspace/ui/components/breadcrumb";
import { BreadcrumbLink } from "@workspace/ui/components/breadcrumb";
import { BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb";
import { BreadcrumbPage } from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { Toolbar } from "./toolbar";

export function AppHeader() {
  return (
    <header className="bg-background sticky top-0 flex flex-col border-b">
      <div className="flex shrink-0 items-center gap-2 p-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>All Files</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Toolbar className="ml-auto" />
      </div>
    </header>
  )
}