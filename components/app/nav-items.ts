import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  LayoutDashboard,
  Settings,
  UsersRound,
  WalletCards
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: UsersRound },
  { href: "/attendance", label: "Attendance", icon: CalendarClock },
  { href: "/finance", label: "Finance", icon: WalletCards },
  { href: "/tasks", label: "Tasks", icon: BriefcaseBusiness },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/dashboard#analytics", label: "Analytics", icon: BarChart3 }
];
