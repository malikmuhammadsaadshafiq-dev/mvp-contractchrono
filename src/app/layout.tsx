import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContractChrono - Contract Deadline Management',
  description: 'Extract critical dates and deadlines from contracts using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}