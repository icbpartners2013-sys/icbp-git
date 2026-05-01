import { Wrench } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

/**
 * Generic "Under Construction" placeholder for feature pages.
 * Replace this component with real content when building the feature.
 */
export default function PagePlaceholder({ title, description }: Props) {
  // Convert camelCase / PascalCase title to readable format
  const readable = title.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{readable}</h1>
      <p className="text-gray-500 mb-8">
        {description || 'This module is under construction.'}
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
          <Wrench className="h-8 w-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h2>
        <p className="text-gray-400 max-w-sm text-sm">
          This feature is being built. Check back soon or ask the AI assistant to
          implement it for you.
        </p>
      </div>
    </div>
  );
}
