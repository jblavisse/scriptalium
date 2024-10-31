import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'vdjango-insecure-a2m#90dr8c&g+m15sxi7*0c!z4yzvy&^@)xpalh=bmv@e!winl'); 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return await handleRefreshToken(request);
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    return await handleRefreshToken(request);
  }
}

async function handleRefreshToken(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (refreshToken) {
    try {
      const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;

        const nextResponse = NextResponse.next();

        nextResponse.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_USE_HTTPS === 'true',
          sameSite: 'lax',
          path: '/',
        });

        return nextResponse;
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/editor/:path*'],
};
