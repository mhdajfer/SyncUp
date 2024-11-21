import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

export default function NoChatComponent() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-100">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to ChatApp
          </CardTitle>
          <CardDescription className="text-gray-400">
            Get started by creating a new chat or joining a group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <svg
              className="w-32 h-32 text-gray-600"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <p className="text-center text-gray-400">
            Start a conversation, collaborate with teammates, or stay connected
            with colleagues .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
