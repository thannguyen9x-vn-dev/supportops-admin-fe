import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { NavGroup } from "../types";

export const navigationConfig: NavGroup[] = [
  {
    groupLabel: "nav.main",
    items: [
      {
        label: "nav.dashboard",
        href: "/dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
      },
      {
        label: "nav.projects",
        href: "/projects",
        icon: <FolderOutlinedIcon fontSize="small" />,
        badge: 3,
        allowedRoles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "nav.team",
        href: "/team",
        icon: <PeopleOutlinedIcon fontSize="small" />,
        allowedRoles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "nav.calendar",
        href: "/calendar",
        icon: <CalendarMonthOutlinedIcon fontSize="small" />,
        allowedRoles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    groupLabel: "nav.analytics",
    items: [
      {
        label: "nav.reports",
        href: "/reports",
        icon: <BarChartOutlinedIcon fontSize="small" />,
        allowedRoles: ["ADMIN", "SUPER_ADMIN"],
        children: [
          {
            label: "nav.reportsOverview",
            href: "/reports/overview",
            icon: <BarChartOutlinedIcon fontSize="small" />,
            allowedRoles: ["ADMIN", "SUPER_ADMIN"],
          },
          {
            label: "nav.reportsPerformance",
            href: "/reports/performance",
            icon: <BarChartOutlinedIcon fontSize="small" />,
            allowedRoles: ["ADMIN", "SUPER_ADMIN"],
          },
        ],
      },
    ],
  },
  {
    groupLabel: "nav.system",
    items: [
      {
        label: "nav.settings",
        href: "/settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
      },
    ],
  },
];
