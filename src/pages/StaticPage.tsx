import React, { useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface StaticPageProps {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const StaticPage: React.FC<StaticPageProps> = ({ title, subtitle, content }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumb items={[{ label: title }]} />

      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">{subtitle}</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-6 text-sm text-gray-600 leading-relaxed">
        {content}
      </div>
    </div>
  );
};
