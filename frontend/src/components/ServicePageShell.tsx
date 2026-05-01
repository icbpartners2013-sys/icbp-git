import { Card, BreadcrumbItem, Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi"; // npm install react-icons

interface ShellProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function ServicePageShell({ title, description, children }: ShellProps) {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <Breadcrumb aria-label="Default breadcrumb example">
        <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
        <BreadcrumbItem href="/client/dashboard">Client Portal</BreadcrumbItem>
        <BreadcrumbItem>{title}</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-icbp-dark">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      <Card>
        {children ? children : (
          <div className="py-10 text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-icbp-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Feature Coming Soon</h2>
            <p className="text-gray-500 mt-2">We are currently setting up the {title} module for your account.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
