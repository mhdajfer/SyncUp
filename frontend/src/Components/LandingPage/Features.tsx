import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  IconAdjustments,
  IconChartBar,
  IconCloud,
  IconEaseInOut,
  IconFolder,
  IconHelp,
  IconUsersGroup,
} from "@tabler/icons-react";

const features = [
  {
    title: "Tailored for Teams",
    description:
      "Built for project managers, teams, and collaborators to streamline workflows.",
    icon: <IconUsersGroup />,
  },
  {
    title: "Intuitive Interface",
    description:
      "Simple, user-friendly design that ensures effortless navigation and usability.",
    icon: <IconEaseInOut />,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Collaborate with your team live—track progress and updates instantly.",
    icon: <Users />,
  },
  {
    title: "Reliable Uptime",
    description:
      "Dependable infrastructure ensures your projects are accessible 24/7.",
    icon: <IconCloud />,
  },
  {
    title: "Multi-Project Support",
    description:
      "Manage multiple projects with ease and stay organized effortlessly.",
    icon: <IconFolder />,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Generate detailed reports to analyze performance and progress.",
    icon: <IconChartBar />,
  },
  {
    title: "Top-notch Customer Support",
    description:
      "Our team is here to help whenever you need guidance or assistance.",
    icon: <IconHelp />,
  },
  {
    title: "Customizable Workflows",
    description:
      "Adapt tools to fit your unique project requirements and processes.",
    icon: <IconAdjustments />,
  },
];

export function Features() {
  return (
    <div id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            What we offer
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Everything you need to manage projects effectively in one place.
          </p>
        </div>

        <div className="mt-20">
          {/* <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Feature key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
