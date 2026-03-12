import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recruit.com.hk – Find Jobs in Hong Kong',
  description: 'Hong Kong\'s leading job platform. Find thousands of jobs across IT, Finance, Sales, Engineering and more.',
  keywords: 'jobs hong kong, recruitment hk, job vacancies, careers hong kong',
  openGraph: {
    title: 'Recruit.com.hk – Find Jobs in Hong Kong',
    description: 'Hong Kong\'s leading job platform connecting talent with employers.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
