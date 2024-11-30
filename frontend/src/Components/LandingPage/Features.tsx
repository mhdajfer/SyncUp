import React from "react";
import { Clock, Users, BarChart, Shield } from "lucide-react";

const features = [
  {
    name: "Real-time Collaboration",
    description:
      "Work together seamlessly with your team in real-time, no matter where they are.",
    icon: Users,
  },
  {
    name: "Time Tracking",
    description:
      "Monitor project progress and team productivity with built-in time tracking tools.",
    icon: Clock,
  },
  {
    name: "Advanced Analytics",
    description:
      "Make data-driven decisions with comprehensive project analytics and insights.",
    icon: BarChart,
  },
  {
    name: "Enterprise Security",
    description:
      "Keep your data safe with enterprise-grade security and compliance features.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <div id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Features that power your productivity
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Everything you need to manage projects effectively in one place.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg"
              >
                <div className="absolute top-6 left-6">
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
