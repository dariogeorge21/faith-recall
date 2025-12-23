import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faith Recall - JAAGO',
  description: 'A Catholic memory & knowledge game for church events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gold-50 to-burgundy-50">
        {children}
      </body>
    </html>
  )
}

