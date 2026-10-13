import type { ReactNode } from "react";

export type QuickAction = {
  id: string;
  label: string;
  description?: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export type QuickActionsProps = {
  actions: QuickAction[];
  title?: string;
  description?: string;
};

export function QuickActions({
  actions,
  title = "Quick actions",
  description = "Common actions at your fingertips",
}: QuickActionsProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.015em] text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-white/35">{description}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className="group flex min-h-24 flex-col items-start justify-between rounded-xl border border-white/8 bg-white/[0.025] p-4 text-left transition-all duration-200 hover:border-[#ff6600]/25 hover:bg-[#ff6600]/5 focus:outline-none focus:ring-2 focus:ring-[#ff6600]/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-white/50 transition-colors group-hover:border-[#ff6600]/20 group-hover:bg-[#ff6600]/10 group-hover:text-[#ff6600]">
              {action.icon}
            </span>

            <span className="mt-4">
              <span className="block text-sm font-medium text-white">
                {action.label}
              </span>

              {action.description && (
                <span className="mt-1 block text-[11px] leading-4 text-white/30">
                  {action.description}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
