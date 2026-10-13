import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift, LayoutDashboard } from "lucide-react";
import { Sidebar } from "./Sidebar";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: <Gift />,
  },
];

const user = {
  name: "John Doe",
  initials: "JD",
};

export function DashboardLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[204px] lg:block">
        <Sidebar
          navigation={navigation}
          user={user}
          activeHref={location.pathname}
          onNavigate={(href) => navigate(href)}
        />
      </aside>

      <main className="min-h-screen lg:pl-[204px]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
