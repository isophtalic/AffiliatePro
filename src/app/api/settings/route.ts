import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/config-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tải cấu hình' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    await saveSettings(settings);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lưu cấu hình' }, { status: 500 });
  }
}
