import { Puck } from "@puckeditor/core";
import type { Config } from "@puckeditor/core"; // Add the 'type' keyword here
import "@puckeditor/core/puck.css";

// 1. Import your existing UI components
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";

const config: Config = {
  components: { 
    // 2. Register the Button
    MyButton: {
      fields: {
        label: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
          ],
        },
      },
      render: ({ label, variant }) => (
        <Button variant={variant}>{label || "Button"}</Button>
      ),
    },

    // 3. Register the Card
    MyCard: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
      },
      render: ({ title, description }) => (
        <Card>
          <CardHeader>
            <CardTitle>{title || "Card Title"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{description || "Card content goes here."}</p>
          </CardContent>
        </Card>
      ),
    },
  },
};

const Editor = ({ pageId }: { pageId: number }) => {
  const handlePublish = async (data: any) => {
    const response = await fetch(`/api/pages/${pageId}/save/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add CSRF token here if required by Django
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Page saved successfully!");
    }
  };

  return (
    <Puck 
      config={config} 
      data={{}} // You should fetch initial data here using useEffect
      onPublish={handlePublish} 
    />
  );
};

export default Editor;
