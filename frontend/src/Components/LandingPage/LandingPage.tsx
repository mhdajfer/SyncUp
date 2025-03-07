import React from "react";
import { Navbar } from "@/Components/LandingPage/Navbar";
import { Hero } from "@/Components/LandingPage/Hero";
import { Features } from "@/Components/LandingPage/Features";
import { Footer } from "@/Components/LandingPage/Footer";
import { GridBackground } from "./GridBackground";
import { Testimonials } from "./Testimonials";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow mb-16">
          <Hero />
          <Features />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </div>
  );
}
