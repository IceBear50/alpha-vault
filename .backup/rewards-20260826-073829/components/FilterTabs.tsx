import { useState } from "react";

const categories = ["All Rewards", "Vouchers", "Cashback", "Travel", "Food & Dining", "Shopping", "Entertainment"];

export function FilterTabs() {
  const [active, setActive] = useState("All Rewards");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              active === category
                ? "bg-[#FF6600] text-black"
                : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <select className="bg-[#111] border border-white/10 text-gray-300 text-xs px-3 py-2 rounded-lg outline-none focus:border-[#FF6600]/40">
        <option>Sort by: Popular</option>
      </select>
    </div>
  );
}