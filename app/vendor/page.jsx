"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard({ vendor }) {
  const router = useRouter();

  const handleLogout = async () => {
    // You can plug this into NextAuth or your custom auth logic
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold text-gray-800 ">
          Welcome: <span className="text-blue-600">John Doe</span> To Irct's Vendor Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center mt-12 px-6">
        <h2 className="text-4xl font-bold text-gray-700 mb-8">Vendor's Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link
            href="/generate_qr"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Generate QR Codes</h3>
            <p className="text-gray-600">Create new QR codes for your products.</p>
          </Link>

          <Link
            href="/inventory"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-green-600">Inventory</h3>
            <p className="text-gray-600">View and manage all your products.</p>
          </Link>

          <Link
            href="/dashboard/shipments"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Shipments</h3>
            <p className="text-gray-600">Track and manage your shipments.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
