import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = "Shop authentic smartphones, active noise cancellation headphones, footwear & fashion on Pakistan's premier e-commerce platform.",
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  ogType = 'website',
  noIndex = false,
  jsonLd,
}) => {
  useEffect(() => {
    try {
      // 1. Update Document Title
      const formattedTitle =
        title && (title.includes('ApnaMart') || title.includes('ApexStore'))
          ? title.replace(/ApexStore/g, 'ApnaMart')
          : `${title || 'ApnaMart'} | ApnaMart Pakistan`;
      document.title = formattedTitle;

      // Helper to update meta tag
      const setMeta = (name: string, content: string, property: boolean = false) => {
        let element = document.querySelector(
          property ? `meta[property="${name}"]` : `meta[name="${name}"]`
        );
        if (!element) {
          element = document.createElement('meta');
          if (property) {
            element.setAttribute('property', name);
          } else {
            element.setAttribute('name', name);
          }
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      // 2. Set Meta Description
      setMeta('description', description);

      // 3. Set Robots Meta
      if (noIndex) {
        setMeta('robots', 'noindex, nofollow');
      } else {
        setMeta('robots', 'index, follow');
      }

      // 4. Set Open Graph & Twitter Meta Tags
      setMeta('og:title', formattedTitle, true);
      const cleanCanonicalUrl = canonicalUrl
        ? canonicalUrl.replace(/https?:\/\/apexstore\.pk/g, 'https://apnamart.space')
        : undefined;

      setMeta('og:description', description, true);
      setMeta('og:image', ogImage, true);
      setMeta('og:type', ogType, true);
      if (cleanCanonicalUrl) {
        setMeta('og:url', cleanCanonicalUrl, true);
      }

      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', formattedTitle);
      setMeta('twitter:description', description);
      setMeta('twitter:image', ogImage);

      // 5. Set Canonical Link
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (cleanCanonicalUrl) {
        if (!linkCanonical) {
          linkCanonical = document.createElement('link');
          linkCanonical.setAttribute('rel', 'canonical');
          document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', cleanCanonicalUrl);
      } else if (linkCanonical) {
        linkCanonical.remove();
      }

      // 6. Set JSON-LD Structured Data
      let scriptJsonLd = document.querySelector('#seo-json-ld');
      if (jsonLd) {
        if (!scriptJsonLd) {
          scriptJsonLd = document.createElement('script');
          scriptJsonLd.setAttribute('id', 'seo-json-ld');
          scriptJsonLd.setAttribute('type', 'application/ld+json');
          document.head.appendChild(scriptJsonLd);
        }
        scriptJsonLd.textContent = JSON.stringify(jsonLd);
      } else if (scriptJsonLd) {
        scriptJsonLd.remove();
      }
    } catch (err) {
      console.warn('SEOHead update warning:', err);
    }
  }, [title, description, canonicalUrl, ogImage, ogType, noIndex, jsonLd]);

  return null;
};
