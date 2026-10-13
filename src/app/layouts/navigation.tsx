import type { SidebarNavItem } from "./Sidebar";
import {
  AnalyticsIcon,
  HelpIcon,
  OverviewIcon,
  RewardsIcon,
  SettingsIcon,
  StatementsIcon,
  TransactionsIcon,
} from "./SidebarIcons";

export const dashboardNavigation: SidebarNavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <OverviewIcon />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <TransactionsIcon />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: <RewardsIcon />,
  },
  {
    label: "Statements",
    href: "/dashboard/statements",
    icon: <StatementsIcon />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsIcon />,
  },
  {
    label: "Help & Support",
    href: "/dashboard/help",
    icon: <HelpIcon />,
  },
];
