import { NextResponse } from 'next/server';
import { generateAffiliateLink } from '@/lib/link-generator';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { url, settings } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Vui lòng cung cấp link Shopee' }, { status: 400 });
    }

    if (!settings) {
      return NextResponse.json({ error: 'Thiếu cấu hình Affiliate' }, { status: 400 });
    }

    const generatedLink = await generateAffiliateLink(url, settings);
    if (!generatedLink) {
      return NextResponse.json({ error: 'Lỗi tạo link' }, { status: 500 });
    }
    return NextResponse.json({ success: true, link: generatedLink });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tạo link' }, { status: 500 });
  }
}
