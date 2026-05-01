import type { ComponentConfig } from "@puckeditor/core";

export const Button: ComponentConfig<{ label: string; variant: "primary" | "secondary" }> = {
  fields: {
    label: { type: "text" },
    variant: {
      type: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
      ],
    },
  },
  render: ({ label, variant }) => (
    <button className={`btn-${variant}`}>{label}</button>
  ),
};
