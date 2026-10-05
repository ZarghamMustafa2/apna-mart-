export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgGradient: string;
}

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export const mockHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    badge: 'NEW GENERATION TECH',
    title: 'Experience Audio Excellence with UltraSound Pro',
    subtitle: 'Adaptive Active Noise Cancellation & 40 Hours Playtime. Up to 30% OFF this week.',
    buttonText: 'Shop Electronics',
    buttonLink: '/shop?category=electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-slate-900 via-brand-950 to-slate-900',
  },
  {
    id: 'hero-2',
    badge: 'SUMMER FASHION SALE',
    title: 'Redefine Your Style with Urban Craft Apparel',
    subtitle: 'Premium cotton Oxford shirts & handcrafted leather accessories designed for comfort.',
    buttonText: 'Explore Fashion',
    buttonLink: '/shop?category=fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-gray-900 via-blue-950 to-gray-900',
  },
  {
    id: 'hero-3',
    badge: 'PERFORMANCE FOOTWEAR',
    title: 'Step into Comfort with ProRunner FlyMesh',
    subtitle: 'High rebound EVA cushioning for explosive energy return. Free shipping nationwide.',
    buttonText: 'Shop Sneakers',
    buttonLink: '/shop?category=shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-zinc-900 via-red-950 to-zinc-900',
  },
];

export const mockPromoBanners: PromoBanner[] = [
  {
    id: 'promo-1',
    tag: 'LIMITED TIME OFFER',
    title: 'Flagship Smartphones',
    subtitle: 'Save up to Rs. 13,000 on 5G Mobiles',
    buttonText: 'View Deals',
    buttonLink: '/shop?category=electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'promo-2',
    tag: 'NEW ARRIVALS',
    title: 'Handcrafted Leather',
    subtitle: '100% Genuine Full-Grain Totes & Bags',
    buttonText: 'Shop Collection',
    buttonLink: '/shop?category=fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  },
];
