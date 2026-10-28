import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable credentials
const ENV_SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL || '') as string;
const ENV_SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '') as string;

// Local storage override keys for dynamic admin configuration
const STORAGE_URL_KEY = 'apnamart_supabase_url';
const STORAGE_KEY_KEY = 'apnamart_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; key: string } {
  let url = (ENV_SUPABASE_URL || '').trim();
  let key = (ENV_SUPABASE_ANON_KEY || '').trim();

  // If not configured in environment variables, check localStorage
  if (!url && typeof window !== 'undefined') {
    url = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
  }
  if (!key && typeof window !== 'undefined') {
    key = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
  }

  return { url, key };
}

export function saveSupabaseCredentials(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
    }

    if (key) {
      localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  }
  // Reinitialize client instance
  initSupabaseClient();
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.length > 20
  );
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
      return null;
    }
  } else {
    supabaseInstance = null;
    return null;
  }
}

// Initial client initialization
initSupabaseClient();

export const supabase = {
  get client(): SupabaseClient | null {
    if (!supabaseInstance && isSupabaseConfigured()) {
      return initSupabaseClient();
    }
    return supabaseInstance;
  },
};

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = supabase.client;
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials are not configured or are invalid.',
    };
  }

  try {
    const { error } = await client.from('settings').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, it's connected to Supabase but schema is missing
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! The database schema needs to be initialized.',
        };
      }
      return {
        success: false,
        message: `Supabase error (${error.code || 'Connection'}): ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to reach Supabase server.',
    };
  }
}
