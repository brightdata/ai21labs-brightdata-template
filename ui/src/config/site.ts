export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "AI21 Maestro + Bright Data",
  description: "Build AI agents with web access through Bright Data tools",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "API Docs",
      href: "http://localhost:8000/docs",
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
  links: {
    github: "https://github.com/brightdata",
    docs: "http://localhost:8000/docs",
  },
};
