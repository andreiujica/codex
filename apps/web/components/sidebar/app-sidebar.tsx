"use client"

import { ComponentProps, useState } from "react" 
import { FolderOpen } from "lucide-react"

import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { AppLogo } from "./app-logo"
import { ProjectList } from "./project-list"

/**
 * This is the sample data for the sidebar. The user data 
 * would come from our identity provider, but for now we are using a sample user.
 */
const data = {
  user: {
    name: "Andrei Ujica",
    email: "andrei@codex.com",
    avatar: "/avatars/andrei.webp",
  },
  navMain: [
    {
      title: "File Explorer",
      url: "/", 
      icon: FolderOpen,
      isActive: true,
    },
  ],
}
/**
 * This component is used to display the app sidebar. It actually displays two sidebars:
 * 1. The first sidebar is the main sidebar that displays the app logo and the main navigation items.
 * 2. The second sidebar is the secondary sidebar that displays the navigation for the projects.
 * 
 * @returns The AppSidebar component
 */
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  /**
   * NOTE: We are using state to show the active item. If we had
   * multiple pages, we would use the url/router to show the active item.
   */
  const [activeItem, setActiveItem] = useState(data.navMain[0])
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <ProjectList />
    </Sidebar>
  )
}
