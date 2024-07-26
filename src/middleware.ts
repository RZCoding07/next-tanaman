import { NextResponse } from "next/server";

export function middleware(req: Request) {
  // Add a header to the response
  return NextResponse.next();
}