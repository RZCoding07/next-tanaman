// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

import { NextResponse } from "next/server";

export function middleware(req: Request) {
  // Add a header to the response
  return NextResponse.next();
}