"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

const LandingPage: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow">
        <div className="flex flex-col items-center justify-center text-center h-screen px-4 py-10">
          <h1 className="text-5xl font-bold text-blue-400">
            Project Management Toolkit
          </h1>
          <p className="mt-6 text-xl max-w-3xl text-gray-400">
            Streamline your workflows, enhance team collaboration, and track
            project progress with the ultimate toolkit for project management.
            Whether you are a developer, manager, or project manager, we’ve got
            the tools to make your job easier.
          </p>

          <div className="flex mt-10 space-x-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
              onClick={() => router.push("/employee/dev")}
            >
              For Developers
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg"
              onClick={() => router.push("/employee/manager")}
            >
              For Managers
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg text-lg"
              onClick={() => router.push("/employee/project_manager")}
            >
              For Project Managers
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-white">
            Why Choose Our Toolkit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-gray-300">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-500">
                Collaborate Effectively
              </h3>
              <p>
                Bring your teams together with real-time collaboration tools,
                keeping everyone on the same page.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-500">
                Track Progress
              </h3>
              <p>
                Visualize your project timelines, milestones, and progress with
                intuitive dashboards and reports.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-yellow-500">
                Manage Resources
              </h3>
              <p>
                Allocate and optimize your resources efficiently to avoid
                bottlenecks and ensure timely delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 py-20 text-center">
        <h2 className="text-4xl font-bold text-white">Get Started Today</h2>
        <p className="mt-4 text-lg text-white">
          Join thousands of teams who trust our toolkit to manage their
          projects.
        </p>
        <div className="mt-6">
          <button
            className="bg-white text-blue-600 py-3 px-8 rounded-lg text-lg hover:bg-gray-100"
            onClick={() => router.push("/get-started")}
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-gray-400">
        <p>&copy; 2024 Project Management Toolkit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
