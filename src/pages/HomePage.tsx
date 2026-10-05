import React, { useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByCategorySection } from '../components/home/ShopByCategorySection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { PromoBanners } from '../components/home/PromoBanners';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { SaleDealsSection } from '../components/home/SaleDealsSection';
import { CategoryShowcaseSection } from '../components/home/CategoryShowcaseSection';
import { TrustSection } from '../components/home/TrustSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { SEOHead } from '../components/common/SEOHead';

export const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'ApnaMart Pakistan',
    url: 'https://apnamart.space/',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    description: "Pakistan's premier destination for authentic electronics, smartphones, fashion & footwear.",
    telephone: '+92-300-1234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Boulevard, Gulberg III',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
  };

  return (
    <div className="space-y-2 sm:space-y-6">
      <SEOHead
        title="ApnaMart | Pakistan's Premier Online Shopping Destination"
        description="Shop authentic smartphones, ANC headphones, smartwatch wearables & fashion sneakers. Cash on Delivery & 7-Day Returns across Pakistan."
        canonicalUrl="https://apnamart.space/"
        jsonLd={organizationSchema}
      />

      {/* 1. Hero / Main Banner */}
      <HeroSection />

      {/* 2. Shop by Category (Prominent Placement) */}
      <ShopByCategorySection />

      {/* 3. Featured Products (Max 8 Products) */}
      <FeaturedProductsSection />

      {/* 4. Promotional Split Banners */}
      <PromoBanners />

      {/* 5. New Arrivals (Max 8 Products) */}
      <NewArrivalsSection />

      {/* 6. Best Sellers (Max 8 Products) */}
      <BestSellersSection />

      {/* 7. Special Deals & Discounts (Max 8 Products) */}
      <SaleDealsSection />

      {/* 8. Department Category Showcases */}
      <CategoryShowcaseSection />

      {/* 9. Trust & Why Choose Us */}
      <TrustSection />

      {/* 10. Customer Testimonials */}
      <TestimonialsSection />

      {/* 11. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
