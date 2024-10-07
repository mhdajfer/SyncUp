interface ModernLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function ModernLoader({
  size = "medium",
}: ModernLoaderProps = {}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  // const colorClasses = {
  //   primary: "bg-primary",
  //   secondary: "bg-secondary",
  //   accent: "bg-accent",
  // };

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-gray-900"
      aria-label="Loading"
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <div
          className={`absolute inset-0 bg-primary rounded-full opacity-75 animate-ping`}
        ></div>
        <div
          className={`absolute inset-0 bg-primary rounded-full opacity-75 animate-pulse`}
        ></div>
      </div>
    </div>
  );
}
