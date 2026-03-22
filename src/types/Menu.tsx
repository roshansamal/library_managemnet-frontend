// types/Menu.ts
export type MenuItem = {
  id: number;
  label: string;
  path: string | null;
  icon?: string | null;
  children?: MenuItem[];
};
