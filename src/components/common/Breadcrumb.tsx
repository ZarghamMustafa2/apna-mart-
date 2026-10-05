import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://apnamart.space/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.link ? `https://apnamart.space${item.link}` : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 py-3 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            {item.link ? (
              <Link to={item.link} className="hover:text-brand-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};
