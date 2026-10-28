import { HeroSlide, PromoBanner } from '../data/mockBanners';
import { dbGetById, dbPut } from './db';
import { isSupabaseConfigured } from './supabase';
import { fetchCmsFromSupabase, saveCmsToSupabase } from './supabaseDb';

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
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchCmsFromSupabase<HeroSlide[]>('hero_slides');
      if (cloud && cloud.length > 0) {
        dbPut('homepage_cms', { id: 'hero_slides', data: cloud }).catch(() => {});
        return cloud;
      }
    } catch (e) {
      console.warn('Supabase getHeroSlides fallback:', e);
    }
  }
  const rec = await dbGetById<{ id: string; data: HeroSlide[] }>('homepage_cms', 'hero_slides');
  return rec?.data || [];
}

export async function saveHeroSlides(slides: HeroSlide[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await saveCmsToSupabase('hero_slides', slides);
    } catch (e) {
      console.error('Supabase saveHeroSlides error:', e);
    }
  }
  await dbPut('homepage_cms', { id: 'hero_slides', data: slides });
}

export async function getPromoBanners(): Promise<PromoBanner[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchCmsFromSupabase<PromoBanner[]>('promo_banners');
      if (cloud && cloud.length > 0) {
        dbPut('homepage_cms', { id: 'promo_banners', data: cloud }).catch(() => {});
        return cloud;
      }
    } catch (e) {
      console.warn('Supabase getPromoBanners fallback:', e);
    }
  }
  const rec = await dbGetById<{ id: string; data: PromoBanner[] }>('homepage_cms', 'promo_banners');
  return rec?.data || [];
}

export async function savePromoBanners(banners: PromoBanner[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await saveCmsToSupabase('promo_banners', banners);
    } catch (e) {
      console.error('Supabase savePromoBanners error:', e);
    }
  }
  await dbPut('homepage_cms', { id: 'promo_banners', data: banners });
}

export async function getHomepageSections(): Promise<HomepageSections> {
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchCmsFromSupabase<HomepageSections>('homepage_sections');
      if (cloud) {
        dbPut('homepage_cms', { id: 'homepage_sections', data: cloud }).catch(() => {});
        return { ...defaultHomepageSections, ...cloud };
      }
    } catch (e) {
      console.warn('Supabase getHomepageSections fallback:', e);
    }
  }
  const rec = await dbGetById<{ id: string; data: HomepageSections }>('homepage_cms', 'homepage_sections');
  return rec?.data ? { ...defaultHomepageSections, ...rec.data } : defaultHomepageSections;
}

export async function saveHomepageSections(sections: HomepageSections): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await saveCmsToSupabase('homepage_sections', sections);
    } catch (e) {
      console.error('Supabase saveHomepageSections error:', e);
    }
  }
  await dbPut('homepage_cms', { id: 'homepage_sections', data: sections });
}
