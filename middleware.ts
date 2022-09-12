import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Adding middleware - we have a bug with effector stores
export function middleware(request: NextRequest) {

return NextResponse.next();
}
