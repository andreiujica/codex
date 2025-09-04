import { useMemo } from 'react';

const ACCENT_COLORS = [
  'bg-blue-500/10 border-l-blue-500 text-blue-600',
  'bg-green-500/10 border-l-green-500 text-green-600',
  'bg-purple-500/10 border-l-purple-500 text-purple-600',
  'bg-orange-500/10 border-l-orange-500 text-orange-600',
  'bg-cyan-500/10 border-l-cyan-500 text-cyan-600',
];

const ICON_COLORS = [
  'bg-blue-400 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
  'bg-green-400 text-white hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500',
  'bg-purple-400 text-white hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500',
  'bg-orange-400 text-white hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500',
  'bg-cyan-400 text-white hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500',
];

const FOLDER_COLORS = [
  'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:group-hover:bg-blue-900/40',
  'bg-green-50 text-green-600 group-hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:group-hover:bg-green-900/40',
  'bg-purple-50 text-purple-600 group-hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:group-hover:bg-purple-900/40',
  'bg-orange-50 text-orange-600 group-hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:group-hover:bg-orange-900/40',
  'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:group-hover:bg-cyan-900/40',
];

/**
 * Hook that provides consistent accent and icon colors for a project
 * based on the project ID. Uses a simple hash function to ensure
 * the same project always gets the same color.
 */
export function useProjectColors(projectId: string) {
  return useMemo(() => {
    // Use project ID to consistently assign the same color
    const colorIndex = projectId.charCodeAt(0) % ACCENT_COLORS.length;
    
    return {
      accentClass: ACCENT_COLORS[colorIndex],
      iconClass: ICON_COLORS[colorIndex],
      folderClass: FOLDER_COLORS[colorIndex],
    };
  }, [projectId]);
}
