import { Sidebar, SidebarGroupContent, SidebarContent, SidebarGroup, SidebarHeader } from "@workspace/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import {useProjectStore} from "@/stores/projects";
import { api } from "@/lib/ky";
import { useEffect } from "react";
import type { Project } from "@/types/api";
import { ProjectCard } from "./project-card";

export function ProjectList() {
  const { activeProjectId, setActiveProjectId } = useProjectStore();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("projects").json(),
  });

  useEffect(() => {
    if (projects && projects.length > 0 && !activeProjectId) {
      /**
       * For now, we just set the first project as the active project 
       * as we know we will only have one project at the moment.
       */
      setActiveProjectId(projects[0]!.id); 
    }
  }, [projects, setActiveProjectId, activeProjectId]);

  /**
   * Loading state, while we wait for the data to load.
   */
  if (isLoading) {
    return (
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="border-b p-4 h-[3.75rem]">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-semibold tracking-tight">
              Workspaces
            </div>
            <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[1.5rem] text-center">
              ⋯
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading workspaces...</div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  /**
   * Empty state, if we have no workspaces.
   */
  if (!projects || projects.length === 0) {
    return (
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="border-b p-4 h-[3.75rem]">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-semibold tracking-tight">
              Workspaces
            </div>
            <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[1.5rem] text-center">
              0
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">No workspaces found</div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="border-b p-4 h-[3.75rem]">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium tracking-tight">
            Workspaces
          </div>
          <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[1.5rem] text-center">
            {projects.length}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {projects.map((project) => {
              const isActive = activeProjectId === project.id;
              
              return <ProjectCard key={project.id} project={project} isActive={isActive} setActiveProjectId={setActiveProjectId} />;
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}