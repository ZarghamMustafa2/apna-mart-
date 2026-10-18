import { HeroSlide, PromoBanner } from '../data/mockBanners';
import { dbGetById, dbPut } from './db';

export interface HomepageSections {
  hero: boolean;
  categories: boolean;
  promo: boolean;
  products: boolean;
  trust: boolean;
  testimonials: boolean;
  newsletter: boolean;
}

export const defaultHomepageSections: HomepageSections = {
  hero: true,
  categories: true,
  promo: true,
  products: true,
  trust: true,
  testimonials: true,
  newsletter: true,
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const rec = await dbGetById<{ id: string; data: HeroSlide[] }>('homepage_cms', 'hero_slides');
  return rec?.data || [];
}

export async function saveHeroSlides(slides: HeroSlide[]): Promise<void> {
  await dbPut('homepage_cms', { id: 'hero_slides', data: slides });
}

export async function getPromoBanners(): Promise<PromoBanner[]> {
  const rec = await dbGetById<{ id: string; data: PromoBanner[] }>('homepage_cms', 'promo_banners');
  return rec?.data || [];
}

export async function savePromoBanners(banners: PromoBanner[]): Promise<void> {
  await dbPut('homepage_cms', { id: 'promo_banners', data: banners });
}

export async function getHomepageSections(): Promise<HomepageSections> {
  const rec = await dbGetById<{ id: string; data: HomepageSections }>('homepage_cms', 'homepage_sections');
  return rec?.data ? { ...defaultHomepageSections, ...rec.data } : defaultHomepageSections;
}

export async function saveHomepageSections(sections: HomepageSections): Promise<void> {
  await dbPut('homepage_cms', { id: 'homepage_sections', data: sections });
}
