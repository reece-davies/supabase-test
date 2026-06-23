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
    <main style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Supabase Items Demo</h1>

      {/* FORM */}
      <form onSubmit={addItem} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Item</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      {/* LIST */}
      <h2>Items</h2>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && <p>No items yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <button onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}