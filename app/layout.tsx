import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planner - Organize seu dia',
  description: 'Anota??es, tarefas e rotina num s? lugar. Simples e moderno.',
  metadataBase: new URL('https://agentic-d4da2bd6.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
