'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-black text-white px-6 py-6 md:py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left side - Text */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Elevate your <br />
            chess <br />
            awareness
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6">
            Unlock deep insights, get targeted analysis and personalised chess learning.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded hover:bg-blue-700 transition"
          >
            Try Demo For Free
          </a>
        </div>

        {/* Right side - Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end items-end">
          <Image
            src="/Background Hero Image.png"
            alt="Chess analysis illustration"
            width={500}
            height={500}
            className="object-contain block align-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
}
