import { Category } from '../types/product';
import { dbGetAll, dbPut, dbDelete } from './db';

export async function getCategories(): Promise<Category[]> {
  return await dbGetAll<Category>('categories');
}

export async function saveCategory(category: Category): Promise<Category> {
  return await dbPut<Category>('categories', category);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return await dbDelete('categories', id);
}
