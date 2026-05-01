import type { ComponentConfig, WithPuckProps } from "@puckeditor/core";

interface ColumnsProps {
  slots: {
    slot1: React.ReactNode;
    slot2: React.ReactNode;
    slot3: React.ReactNode;
  };
}

const Columns3: ComponentConfig<WithPuckProps<ColumnsProps>> = {
  render: ({ slots }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
      <div>{slots.slot1}</div>
      <div>{slots.slot2}</div>
      <div>{slots.slot3}</div>
    </div>
  ),
};

const Columns2: ComponentConfig<WithPuckProps<ColumnsProps>> = {
  render: ({ slots }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>{slots.slot1}</div>
      <div>{slots.slot2}</div>
    </div>
  ),
};

export { Columns2, Columns3 };