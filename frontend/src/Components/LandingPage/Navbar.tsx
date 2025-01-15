"use client";
import { MoveRight } from "lucide-react";
import SyncupLogo from "../../../public/syncup-logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  return (
    <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex cursor-pointer">
            <Image src={SyncupLogo} alt="SyncUp-Logo" width={30} height={30} />
            <span className="ml-2 text-xl font-bold text-white">SyncUp</span>
          </div>
          <div
            className="text-white flex items-center cursor-pointer space-x-2 transition-transform duration-100 ease-linear transform hover:scale-110"
            onClick={() => router.push("/login")}
          >
            <span className="text-medium ">Login</span>
            <MoveRight />
          </div>
        </div>
      </div>
    </nav>
  );
}
