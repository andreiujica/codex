import { useMemo } from 'react';

const ACCENT_COLORS = [
  'bg-blue-500/10 border-l-blue-500 text-blue-600',
  'bg-green-500/10 border-l-green-500 text-green-600',
  'bg-purple-500/10 border-l-purple-500 text-purple-600',
  'bg-orange-500/10 border-l-orange-500 text-orange-600',
  'bg-pink-500/10 border-l-pink-500 text-pink-600',
  'bg-cyan-500/10 border-l-cyan-500 text-cyan-600',
];

const ICON_COLORS = [
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-purple-500 text-white',
  'bg-orange-500 text-white',
  'bg-pink-500 text-white',
  'bg-cyan-500 text-white',
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
    };
  }, [projectId]);
}
