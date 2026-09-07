// app/utilsComponents/ViewTabs.tsx
"use client";

interface Tab {
  key:   string;
  label: string;
}

interface ViewTabsProps {
  tabs:      Tab[];
  active:    string;
  onChange:  (key: string) => void;
}

export default function ViewTabs({ tabs, active, onChange }: ViewTabsProps) {
  return (
    <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px
            ${active === tab.key
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}