"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

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
    <ul className={className} style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {items.map((item) => (
        <li
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: item.met ? "#16a34a" : "var(--mui-palette-grey-500)",
          }}
        >
          {item.met ? (
            <CheckCircleIcon fontSize="small" sx={{ color: "#16a34a" }} />
          ) : (
            <RadioButtonUncheckedIcon fontSize="small" sx={{ color: "var(--mui-palette-grey-400)" }} />
          )}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
