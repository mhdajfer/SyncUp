"use client";

import React from "react";
import { InfiniteMovingCards } from "./Infinite-moving-cards";

export function Testimonials() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <div className="mb-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Trusted by Teams, Loved by Leaders
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          See how our project management toolkit transforms the way teams
          collaborate and achieve success.
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "This platform has completely revolutionized how we manage our projects. Real-time updates and collaboration features keep our team aligned and productive.",
    name: "Sarah Johnson",
    title: "Project Manager, Tech Solutions Inc.",
  },
  {
    quote:
      "The reporting tools are a game-changer. I can now analyze project performance in minutes and make informed decisions for my team.",
    name: "David Lee",
    title: "Team Lead, Creative Studios",
  },
  {
    quote:
      "Managing multiple projects was overwhelming before SyncUp. Now, everything is centralized, and our workflows have never been smoother.",
    name: "Priya Kapoor",
    title: "Operations Head, Innovate Corp.",
  },
  {
    quote:
      "The intuitive interface made onboarding our team seamless. We got up and running in no time, and productivity has skyrocketed since.",
    name: "James O'Connor",
    title: "CEO, Agile Networks",
  },
  {
    quote:
      "The customer support team is phenomenal. They helped us tailor the platform to our specific needs, making it an invaluable tool for our organization.",
    name: "Emily Chen",
    title: "Program Director, Growth Hub Co.",
  },
];
