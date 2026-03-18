export interface MenuItem {
  title: string;
  icon?: string;
  image?: string;
  route?: string;
  roles: string[];   // ✅ antes era number[]
  grupos: string[];  // ✅ antes era number[]
  submenus?: MenuItem[];
}
