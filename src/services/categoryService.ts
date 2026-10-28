import { Category } from '../types/product';
import { dbGetAll, dbPut, dbDelete } from './db';
import { isSupabaseConfigured } from './supabase';
import {
  fetchCategoriesFromSupabase,
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
} from './supabaseDb';

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloudCategories = await fetchCategoriesFromSupabase();
      if (cloudCategories && cloudCategories.length > 0) {
        // Cache to local for resilience
        for (const cat of cloudCategories) {
          dbPut('categories', cat).catch(() => {});
        }
        return cloudCategories;
      }
    } catch (e) {
      console.warn('Supabase getCategories fallback to local db:', e);
    }
  }
  return await dbGetAll<Category>('categories');
}

export async function saveCategory(category: Category): Promise<Category> {
  if (isSupabaseConfigured()) {
    try {
      await saveCategoryToSupabase(category);
    } catch (e) {
      console.error('Supabase saveCategory error:', e);
    }
  }
  return await dbPut<Category>('categories', category);
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await deleteCategoryFromSupabase(id);
    } catch (e) {
      console.error('Supabase deleteCategory error:', e);
    }
  }
  return await dbDelete('categories', id);
}
