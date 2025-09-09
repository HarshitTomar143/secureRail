"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function InventoryPage() {
  const [inventory, setInventory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("product_type");

        if (error) {
          throw new Error(error.message);
        }

        const counts = products.reduce((acc, product) => {
          const type = product.product_type || "Other";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        setInventory(counts);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setError("Failed to fetch inventory data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productIcons = {
    "Rail Clips": "🔩",
    "Rail Pads": "🧱",
    "Food": "🍔",
    "Other": "📦",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold text-blue-700">Loading Inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Product Inventory Dashboard</h1>
      <p className="text-center text-gray-600 mb-8">Current stock levels for all product types.</p>
      <div className="flex flex-wrap justify-center gap-6">
        {Object.keys(inventory).map((type) => (
          <div 
            key={type}
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-blue-200 w-full max-w-xs transition-transform transform hover:scale-105"
          >
            <div className="text-5xl mb-4">
              {productIcons[type] || productIcons["Other"]}
            </div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">{type}</h2>
            <p className="text-3xl font-bold text-gray-900">{inventory[type]}</p>
            <p className="text-gray-500">Products in Stock</p>
          </div>
        ))}
        {Object.keys(inventory).length === 0 && (
          <div className="text-center text-lg text-gray-500">
            No products found. Generate some products to see the inventory.
          </div>
        )}
      </div>
    </div>
  );
}
