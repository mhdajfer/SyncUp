"use client";
import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">{`Sync Your Team's Work`}</span>
            <span className="block text-indigo-400">Like Never Before</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            SyncUp brings your teams, tools, and projects together in one
            seamless platform. Stay in sync, deliver faster, and achieve more.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 "
                onClick={() => router.push("/signup")}
              >
                Start Here
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6 text-gray-300">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-indigo-400" />
              <span className="ml-2">free registration</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-indigo-400" />
              <span className="ml-2">No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
