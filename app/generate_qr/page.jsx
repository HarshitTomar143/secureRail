"use client";

import { useState } from "react";

export default function GenerateQRPage() {
  const [form, setForm] = useState({
    vendor_id: "",
    vendor_name: "",
    product_type: "",
    manufactured_location: "",
    manufactured_time: "",
  });

  const [qrUrl, setQrUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setQrUrl(null);
    setError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate QR code.");
      }

      const data = await res.json();
      if (data.qr_image_url) {
        setQrUrl(data.qr_image_url);
      } else {
        throw new Error("QR code URL not found in response.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-6">Product Tracking</h1>

      <div className="max-w-lg w-full">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-blue-200"
        >
          <p className="text-gray-700 font-semibold text-lg mb-4">Generate Product QR Code</p>
          <select
            name="vendor_name"
            value={form.vendor_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
          >
            <option value="">Select Vendor Name</option>
            <option value="John Doe">John Doe</option>
            
          </select>

          <select
            name="vendor_id"
            value={form.vendor_id}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
          >
            <option value="">Select Vendor's Id</option>
            <option value="a45b84be-3fe9-4823-a9df-fcaaa01649c3">a45b84be-3fe9-4823-a9df-fcaaa01649c3</option>
          </select>
          

          <select
            name="product_type"
            value={form.product_type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
          >
            <option value="">Select Product Type</option>
            <option value="Rail Clips">Rail Clips</option>
            <option value="Rail Pads">Rail Pads</option>
            <option value="Food">Food</option>
          </select>

          <input
            type="text"
            name="manufactured_location"
            placeholder="Manufactured Location"
            value={form.manufactured_location}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
          />

          <input
            type="datetime-local"
            name="manufactured_time"
            value={form.manufactured_time}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p>{error}</p>
          </div>
        )}

        {qrUrl && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-blue-200 text-center">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">QR Code Generated</h2>
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 border border-gray-300 p-2 mx-auto rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
