import type { AffiliateSettings } from './affiliate-store';

const baseURL = "https://s.shopee.vn/an_redir";

export async function generateAffiliateLink(originalUrl: string, settings: AffiliateSettings): Promise<string> {
  if (!settings.affiliateId) {
    throw new Error('Chưa cấu hình Affiliate ID. Vui lòng vào phần Cấu hình để nhập.');
  }

  try {
    const { originLinkProduct, err } = await getRedirect(originalUrl);
    if (err) {
      throw err;
    }

    const params: Record<string, string> = {
      origin_link: originLinkProduct!,
      channel_type: "fb",
      content_source: "fb",
      share_channel_code: "4",
      affiliate_id: settings.affiliateId,
      sub_id: settings.subIds?.join(',') || '',
      deep_and_deferred: "1",
    };

    const url = new URL(baseURL);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

async function getRedirect(shortUrl: string): Promise<{ originLinkProduct: string | null, err: Error | null }> {
  const response = await fetch(shortUrl, {
    method: "GET",
    redirect: "manual",
  });
  let location = response.headers.get('location')!
  if (!location) {
    return {
      originLinkProduct: null,
      err: new Error('Không lấy được link sản phẩm từ link rút gọn')
    };
  }
  const url = new URL(location);

  const parts = url.pathname.split("/");

  const idProduct = `${parts[2]}/${parts[3]}`;

  return {
    originLinkProduct: `https://shopee.vn/product/${idProduct}`,
    err: null
  };
}