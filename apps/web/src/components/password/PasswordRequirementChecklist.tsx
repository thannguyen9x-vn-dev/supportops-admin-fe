"use client";

type PasswordRequirementChecklistProps = {
  items: Array<{
    key: string;
    label: string;
    met: boolean;
  }>;
  className?: string;
};

export function PasswordRequirementChecklist({ items, className }: PasswordRequirementChecklistProps) {
  return (
    <ul className={className} style={{ margin: 0 }}>
      {items.map((item) => (
        <li
          key={item.key}
          style={{
            color: item.met ? "var(--mui-palette-primary-main)" : "var(--mui-palette-grey-500)",
          }}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
