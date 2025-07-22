'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-black shadow-md mb-0">
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Chess Aware Transparent White V2.png"
            alt="ChessAware Logo"
            width={230}
            height={65}
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Pricing
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            How it Works
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Why ChessAware
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Log in
          </Link>
          <Link
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
