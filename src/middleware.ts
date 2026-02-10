import {createServerClient, type CookieOptions} from '@supabase/ssr'
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    req.cookies.set({name, value, ...options})
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({name, value, ...options})
                },
                remove(name: string, options: CookieOptions) {
                    req.cookies.set({name, value: '', ...options})
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({name, value: '', ...options})
                },
            },
        }
    )
    const {data: {user}} = await supabase.auth.getUser()

    const protectedPaths = ['/', '/invoices', '/orders']
    const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

    if (!user && isProtected) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/invoices/:path*', '/orders/:path*'],
}