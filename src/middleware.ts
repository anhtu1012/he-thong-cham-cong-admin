// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
export function middleware() {
  //req: NextRequest
  //   const token = req.cookies.get("token")?.value;
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   // decode token, nếu lỗi thì đưa về login
  //   try {
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const payload = JSON.parse(atob(base64));
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     if (!payload.exp || payload.exp < currentTime) {
  //       console.log("Token expired. Redirecting to login.");
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }
  //   } catch (error) {
  //     console.log("Middleware Token Error:" + error);
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!/|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
