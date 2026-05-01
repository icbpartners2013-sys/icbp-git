import type { ComponentConfig } from "@puckeditor/core";

// 1. Define what data this component needs
export type CardProps = {
  title: string;
  description: string;
};

// 2. Export the Puck configuration for this specific component
export const Card: ComponentConfig<CardProps> = {
  fields: {
    title: { type: "text" },
    description: { type: "textarea" },
  },
  render: ({ title, description }) => (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  ),
};
