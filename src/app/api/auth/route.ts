import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await signToken({ username, role: 'admin' });
      
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      });
      
      return response;
    }
    
    return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
