import { createClient } from '@supabase/supabase-js';

export interface AffiliateSettings {
  affiliateId: string;
  subIds: string[];
  articleLink: string;
  pageLink: string;
}

const DEFAULT_SETTINGS: AffiliateSettings = {
  affiliateId: '',
  subIds: [''],
  articleLink: '',
  pageLink: '',
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase Client if env vars are present
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function getSettings(): Promise<AffiliateSettings> {
  if (!supabase) {
    console.warn('Supabase is not configured. Returning default settings.');
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('affiliate_id, sub_ids, article_link, page_link')
      .eq('id', 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return { ...DEFAULT_SETTINGS };
      }
      console.error('Error fetching settings from Supabase:', error);
      return { ...DEFAULT_SETTINGS };
    }

    if (data) {
      return {
        affiliateId: data.affiliate_id || '',
        subIds: Array.isArray(data.sub_ids) ? data.sub_ids : [''],
        articleLink: data.article_link || '',
        pageLink: data.page_link || '',
      };
    }
    
    return { ...DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Unexpected error fetching from Supabase:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AffiliateSettings): Promise<void> {
  if (!supabase) {
    throw new Error('Hệ thống chưa được cấu hình biến môi trường Supabase.');
  }

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 1,
        affiliate_id: settings.affiliateId,
        sub_ids: settings.subIds,
        article_link: settings.articleLink,
        page_link: settings.pageLink,
      });

    if (error) {
      console.error('Error saving settings to Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error saving to Supabase:', error);
    throw error;
  }
}
