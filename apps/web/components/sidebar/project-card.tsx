import { useTimeAgo } from "@/hooks/use-time-ago";
import { useProjectColors } from "@/hooks/use-project-colors";
import type { Project } from "@/types/api";
import { Box } from "lucide-react";


interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  setActiveProjectId: (id: string) => void;
}

/**
 * This component represents a project in the secondary sidebar.
 */
export function ProjectCard({ project, isActive, setActiveProjectId }: ProjectCardProps) {
  const { accentClass, iconClass } = useProjectColors(project.id);
  return (
    <button
      key={project.id}
      onClick={() => setActiveProjectId(project.id)}
      className={`
        relative flex items-start gap-3 border-b p-4 text-left transition-colors w-full
        ${isActive 
          ? `${accentClass} border-l-2` 
          : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        }
      `}
    >
      {/* Project Icon */}
      <div className={`
        mt-0.5 rounded-md p-1.5 flex-shrink-0
        ${isActive 
          ? iconClass 
          : 'bg-muted text-muted-foreground'
        }
      `}>
        <Box className="h-4 w-4" />
      </div>
      
      {/* Project Content */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm truncate">
            {project.name}
          </h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {useTimeAgo(project.createdAt)}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description || "No description available"}
        </p>
      </div>
      
    </button>
  );
}