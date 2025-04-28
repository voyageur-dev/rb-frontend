export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Revision Buddy",
  description: "Best website to get your exams passed",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse",
      href: "/browse",
    },
    {
      label: "Mock",
      href: "/pricing",
    },
    {
      label: "Bookmark",
      href: "/bookmarks",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  access: {
    login: "/login",
    register: "/register",
  },
};
