import type { Metadata } from 'next'
import './globals.css'
import { MiniKitProvider } from '@/components/MiniKitProvider'

export const metadata: Metadata = {
  title: 'Nexus',
  description: 'Nexus mini app prototype',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <MiniKitProvider>
          {children}
        </MiniKitProvider>
      </body>
    </html>
  )
}
