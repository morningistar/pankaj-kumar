import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Portfolio } from "./components/Portfolio";
import { AdminPanel } from "./components/AdminPanel";
import { useState } from "react";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Authenticated>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAdmin ? "View Portfolio" : "Admin Panel"}
          </button>
          <SignOutButton />
        </div>
        {showAdmin ? <AdminPanel /> : <Portfolio />}
      </Authenticated>
      
      <Unauthenticated>
        <Portfolio />
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Admin Login
          </button>
        </div>
        {showAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Login</h2>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <SignInForm />
            </div>
          </div>
        )}
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}
