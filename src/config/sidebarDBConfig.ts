// src/config/sidebarDBConfig.ts
export type SidebarItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
  requiredPermissions?: string[]; // slugs
};

export const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', requiredPermissions: ['view-dashboard'] },
  { label: 'Tours', path: '/mgr/tourlist', requiredPermissions: ['view-tours'] },
  { label: 'Approvals', path: '/mgr/toursapproved', requiredPermissions: ['approve-tours'] },
  // ...
];
