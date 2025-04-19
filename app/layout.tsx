import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import MobileMenu from '@/components/MobileMenu';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Medical Symptom Checker',
  description: 'Check your symptoms and find potential causes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header
          className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b border-opacity-30"
          style={{ background: '#102a43', borderColor: '#334e68' }}
        >
          <div className="container mx-auto px-4 py-2 md:py-4 flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 md:w-8 md:h-8 text-blue-500"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="text-xl font-semibold">
                  <span className="text-white">Symptom</span>
                  <span style={{ color: '#2dd4bf' }}>Dx</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-teal-400">
                  <span>Features</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link
                href="#hiw"
                className="text-gray-300 hover:text-teal-400 font-medium"
              >
                How it Works
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-teal-400">
                Blog
              </Link>
              <Link
                href="/patients"
                className="text-gray-300 hover:text-teal-400"
              >
                For Patients
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium text-white hover:bg-opacity-80"
                style={{ borderColor: '#486581', background: '#243b53' }}
              >
                Log In
              </Link>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90"
                style={{ background: '#0967d2' }}
              >
                Try for Free
              </Link>
              <MobileMenu />
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-var(--header-height)-100px)] spacing-responsive">
          {children}
        </main>

        <footer
          className="py-8 sm:py-12 border-t border-opacity-30"
          style={{ background: '#243b53', borderColor: '#334e68' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <Link
                  href="/"
                  className="flex items-center space-x-2 justify-center md:justify-start"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 md:w-8 md:h-8 text-blue-500"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="text-xl font-semibold">
                    <span className="text-white">Symptom</span>
                    <span style={{ color: '#2dd4bf' }}>Dx</span>
                  </span>
                </Link>
                <p className="mt-2 text-sm text-gray-400">
                  LESS PAPERWORK, MORE CARE
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                    Product
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        How it Works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                    Company
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                    Support
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Privacy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                    Legal
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                      >
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} SymptomDx. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
