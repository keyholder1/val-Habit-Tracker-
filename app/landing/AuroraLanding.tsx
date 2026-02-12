'use client'

import Aurora from '@/components/Aurora'
import Link from 'next/link'

export default function AuroraLanding() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Aurora Background */}
            <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <Aurora
                    colorStops={['#7cff67', '#B19EEF', '#5227FF']}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
                <div className="text-center space-y-8 px-4">
                    <h1
                        className="text-6xl md:text-8xl font-serif"
                        style={{ fontFamily: 'Times New Roman, Times, serif' }}
                    >
                        Hello Nandini Zunder
                    </h1>

                    <h2
                        className="text-5xl md:text-7xl font-palatino"
                        style={{ fontFamily: 'Palatino Linotype, Palatino, Georgia, serif' }}
                    >
                        Welcome
                    </h2>

                    <Link
                        href="/dashboard"
                        className="inline-block mt-12 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-xl font-medium transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                        Next →
                    </Link>
                </div>
            </div>
        </div>
    )
}
