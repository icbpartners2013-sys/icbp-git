import type { ComponentConfig } from "@puckeditor/core";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const Hero: ComponentConfig<HeroProps> = {
  render: ({ title, description, imageUrl }) => {
    return (
      <div className="hero">
        <img src={imageUrl} alt={title} />
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    );
  },
};

export default Hero;