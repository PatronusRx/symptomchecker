'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <button
        className="md:hidden text-white"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        id="mobile-menu-button"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(16, 42, 67, 0.95)' }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
            <Link
              href="#hiw"
              className="text-xl text-white font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/blog"
              className="text-xl text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/patients"
              className="text-xl text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Patients
            </Link>
            <div className="flex flex-col space-y-4 w-full mt-6">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center px-4 py-3 border rounded-md text-base font-medium text-white"
                style={{ borderColor: '#486581', background: '#243b53' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white"
                style={{ background: '#0967d2' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Try for Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
