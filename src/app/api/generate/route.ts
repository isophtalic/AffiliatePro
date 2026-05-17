import { NextResponse } from "next/server";
import { generateAffiliateLink } from "@/lib/link-generator";
import { getSettings } from "@/lib/config-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp link Shopee" },
        { status: 400 },
      );
    }

    const settings = await getSettings();

    if (!settings || !settings.affiliateId) {
      return NextResponse.json(
        { error: "Hệ thống chưa được cấu hình Affiliate ID" },
        { status: 400 },
      );
    }

    const generatedLink = await generateAffiliateLink(url, settings);
    if (!generatedLink) {
      return NextResponse.json({ error: "Lỗi tạo link" }, { status: 500 });
    }
    return NextResponse.json({ success: true, link: generatedLink });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Lỗi tạo link" },
      { status: 500 },
    );
  }
}
