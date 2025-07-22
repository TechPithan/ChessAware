'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-black text-white -mt-6 pt-4 pb-8 px-6"><p>sootha moodu</p>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between">
        {/* Left side - Text */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Elevate your chess awareness
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Unlock deep insights, get targeted analysis and personalised chess learning.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Try Demo For Free
          </a>
        </div>

        {/* Right side - Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/Background Hero Image.png"
            alt="Chess analysis illustration"
            width={360}
            height={480}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
