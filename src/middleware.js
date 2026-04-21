import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    console.log('🔐 Middleware Check:', {
      pathname,
      hasToken: !!token,
      role: token?.role,
      isAdmin: token?.role === 'admin'
    });

    // Chặn User không phải Admin vào trang /admin
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        console.log('❌ Redirect non-admin to home');
        return NextResponse.redirect(new URL("/", req.url));
      }
      console.log('✅ Admin allowed to access /admin');
    }

    // Checkout, Orders, Profile require login (any user)
    if (['/checkout', '/orders', '/profile'].some(path => pathname.startsWith(path))) {
      if (!token) {
        console.log('❌ Redirect need login');
        return NextResponse.redirect(new URL("/login", req.url));
      }
      console.log('✅ Logged-in user allowed');
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (['/login', '/register', '/products', '/'].some(p => pathname === p || pathname.startsWith(p + '/'))) {
          return true;
        }
        
        // Admin routes - need token
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
          return !!token;
        }
        
        // Other protected routes - need token
        if (['/checkout', '/orders', '/profile'].some(p => pathname.startsWith(p))) {
          return !!token;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/checkout/:path*", "/profile/:path*", "/orders/:path*"],
};
