import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_CHECKOUT_URL
  if (url && /^https?:\/\//.test(url)) {
    return NextResponse.redirect(url)
  }
  return NextResponse.json({ demo: true })
}
