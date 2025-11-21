import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/hero.png";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 md:px-10 bg-neutral-900">
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl py-20">
                {/* Left: Hero Content */}
                <div className="flex flex-col w-full md:w-1/2 gap-8">
                    <h1 className="text-4xl md:text-7xl font-bold text-neutral-100 leading-tighter uppercase">
                        Intelligent
                        <br />
                        <span className="text-neutral-100">Wallet App</span>
                        <br />
                        For You
                    </h1>

                    {/* Keywords Row */}
                    <div className="flex md:flex-row gap-6 md:gap-14 text-lg md:text-2xl font-medium text-emerald-500 uppercase">
                        <p className="pl-1">Track</p>
                        <p className="pl-1">Analyze</p>
                        <p className="pl-1">Grow</p>
                    </div>

                    {/* CTA Button */}
                    <Link href="/dashboard" className="mt-3 w-fit">
                        <button className="px-8 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-medium text-lg uppercase">
                            Get Started
                        </button>
                    </Link>
                </div>

                {/* Right: Hero Image */}
                <div className="hidden md:flex justify-center items-center h-full">
                    <Image
                        src={heroImage}
                        alt="TrackBud Hero"
                        className="h-120 w-auto object-contain"
                    />
                </div>
            </div>
        </main>
    );
}
