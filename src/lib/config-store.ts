import fs from 'fs/promises';
import path from 'path';

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

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

export async function getSettings(): Promise<AffiliateSettings> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(data) as AffiliateSettings;
  } catch (error: any) {
    // If file doesn't exist, return default settings
    if (error.code === 'ENOENT') {
      return { ...DEFAULT_SETTINGS };
    }
    console.error('Error reading config.json:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AffiliateSettings): Promise<void> {
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing config.json:', error);
    throw error;
  }
}
