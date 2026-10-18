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
import { useAdminData } from '../context/AdminDataContext';

export const HomePage: React.FC = () => {
  const { homepageSections } = useAdminData();

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
      {homepageSections?.hero !== false && <HeroSection />}

      {/* 2. Shop by Category (Prominent Placement) */}
      {homepageSections?.categories !== false && <ShopByCategorySection />}

      {/* 3. Featured Products, New Arrivals, Best Sellers, Deals */}
      {homepageSections?.products !== false && (
        <>
          <FeaturedProductsSection />
          <NewArrivalsSection />
          <BestSellersSection />
          <SaleDealsSection />
        </>
      )}

      {/* 4. Promotional Split Banners */}
      {homepageSections?.promo !== false && <PromoBanners />}

      {/* 5. Department Category Showcases */}
      {homepageSections?.categories !== false && <CategoryShowcaseSection />}

      {/* 6. Trust & Why Choose Us */}
      {homepageSections?.trust !== false && <TrustSection />}

      {/* 7. Customer Testimonials */}
      {homepageSections?.testimonials !== false && <TestimonialsSection />}

      {/* 8. Newsletter Subscription */}
      {homepageSections?.newsletter !== false && <NewsletterSection />}
    </div>
  );
};
