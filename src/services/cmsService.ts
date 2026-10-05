import { HeroSlide, PromoBanner } from '../data/mockBanners';
import { dbGetById, dbPut } from './db';

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
