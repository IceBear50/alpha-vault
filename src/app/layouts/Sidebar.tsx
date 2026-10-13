import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
};

export type SidebarUser = {
  initials: string;
  name: string;
  subtitle?: string;
};

export type SidebarProps = {
  brand?: ReactNode;
  navigation: SidebarNavItem[];
  user: SidebarUser;
  footerContent?: ReactNode;
  activeHref?: string;
  onNavigate?: (href: string) => void;
};

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <span className="sidebar__icon" aria-hidden="true">
      {children}
    </span>
  );
}

export function Sidebar({
  brand = "Aetheris.",
  navigation,
  user,
  footerContent,
  activeHref,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand">{brand}</div>

      <nav className="sidebar__navigation" aria-label="Dashboard navigation">
        <ul className="sidebar__navigation-list">
          {navigation.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <li key={item.href} className="sidebar__navigation-list-item">
                <Link
                  className={`sidebar__navigation-item${
                    isActive ? " sidebar__navigation-item--active" : ""
                  }`}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    if (!onNavigate) {
                      return;
                    }

                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                >
                  <SidebarIcon>{item.icon}</SidebarIcon>

                  <span className="sidebar__navigation-label">
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span className="sidebar__navigation-badge">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {footerContent && (
        <div className="sidebar__footer">{footerContent}</div>
      )}

      <div className="sidebar__user">
        <div className="sidebar__user-avatar" aria-hidden="true">
          {user.initials}
        </div>

        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{user.name}</span>

          {user.subtitle && (
            <span className="sidebar__user-subtitle">{user.subtitle}</span>
          )}
        </div>

        <button
          type="button"
          className="sidebar__user-menu"
          aria-label={`Open ${user.name} account menu`}
        >
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </aside>
  );
}