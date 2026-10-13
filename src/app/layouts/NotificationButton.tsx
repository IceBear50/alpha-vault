import { HeaderAction } from "./HeaderAction";

export type NotificationButtonProps = {
  count?: number;
  onClick?: () => void;
};

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

export function NotificationButton({
  count = 0,
  onClick,
}: NotificationButtonProps) {
  return (
    <div className="relative">
      <HeaderAction
        icon={<BellIcon />}
        label={
          count > 0
            ? `Notifications, ${count} unread`
            : "Notifications"
        }
        onClick={onClick}
      />

      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full border border-[#080808] bg-[#ff6600] px-1 text-[9px] font-semibold leading-none text-white"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}
