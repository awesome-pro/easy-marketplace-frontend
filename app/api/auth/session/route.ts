import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function handleAuthError(errorMessage: string, errorCode?: string, returnUrl?: string): NextResponse {
  if (errorCode) {
    return NextResponse.json(
      { 
        error: errorMessage, 
        code: errorCode,
        isSignedIn: false 
      }, 
      { status: errorCode.startsWith('ACCOUNT_') ? 403 : 401 }
    );
  }
  
  const redirectUrl = new URL('/auth/sign-in', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  if (errorMessage) {
    redirectUrl.searchParams.set('error', encodeURIComponent(errorMessage));
  }
  if (returnUrl) {
    redirectUrl.searchParams.set('returnUrl', encodeURIComponent(returnUrl));
  }
  const redirectResponse = NextResponse.redirect(redirectUrl, { status: 302 });
  redirectResponse.cookies.delete(AUTH_TOKEN_KEY);
  redirectResponse.cookies.delete(REFRESH_TOKEN_KEY);
  return redirectResponse;
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl') || undefined;
  const isApiRequest = request.headers.get('accept')?.includes('application/json') || 
                       request.headers.get('Content-Type')?.includes('application/json');

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  if (accessToken && refreshToken) {
    console.log('Both tokens present');
    return NextResponse.json({ isSignedIn: true }, { status: 200 });
  }

  if (!refreshToken) {
    console.log('No refresh token found');
    return handleAuthError('No refresh token found', isApiRequest ? 'NO_REFRESH_TOKEN' : undefined, returnUrl);
  }

  console.log('Only refreshToken present, attempting to refresh session');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Token refresh failed';
      const errorCode = errorData.code || 'REFRESH_TOKEN_FAILED';
      
      const clearCookieResponse = handleAuthError(errorMessage, isApiRequest ? errorCode : undefined, returnUrl);
      clearCookieResponse.cookies.delete(REFRESH_TOKEN_KEY);
      return clearCookieResponse;
    }

    const data = await response.json();
    console.log('Refreshed session successfully: ', data);
    const { user } = data;
    
    if (user.status !== 'ACTIVE') {
      return handleAuthError('User account is not active', isApiRequest ? 'INACTIVE' : undefined, returnUrl);
    }
    return NextResponse.json({ isSignedIn: true, user }, { status: 200 });
  } catch (error) {
    console.error('Refresh token error:', error);
    return handleAuthError('Failed to get user details', isApiRequest ? 'REFRESH_ERROR' : undefined, returnUrl);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}