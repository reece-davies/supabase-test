"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // READ
  async function fetchItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  // CREATE
  async function addItem(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const { error } = await supabase.from("items").insert({
      title,
      description,
    });

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    setTitle("");
    setDescription("");
    fetchItems();
  }

  // DELETE
  async function deleteItem(id) {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Supabase Test Demo
          </h1>
          <p className="mt-2 text-slate-600">
            Create, view, and delete items stored in Supabase.
          </p>
        </div>

        {/* Form Card */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Add New Item
          </h2>

          <form onSubmit={addItem} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Items Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Items
          </h2>

          {loading && (
            <div className="py-8 text-center text-slate-500">
              Loading...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-slate-500">
              No items yet.
            </div>
          )}

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}