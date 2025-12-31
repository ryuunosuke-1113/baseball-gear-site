"use client";

import { useMemo, useState } from "react";
import { getProducts, getUnique, type Product } from "@/lib/products";

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);
}

export default function HomePage() {
  const all = useMemo(() => getProducts(), []);
  const categories = useMemo(() => getUnique(all.map((p) => p.category)).sort(), [all]);
  const brands = useMemo(() => getUnique(all.map((p) => p.brand)).sort(), [all]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return all.filter((p) => {
      const hitQ =
        !keyword ||
        [p.name, p.summary, p.brand, p.category, ...(p.features ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const hitCat = !category || p.category === category;
      const hitBrand = !brand || p.brand === brand;

      return hitQ && hitCat && hitBrand;
    });
  }, [all, q, category, brand]);

  return (
    <div style={{ padding: 16, maxWidth: 1024, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 14px" }}>野球用品カタログ</h1>
      <p style={{ color: "#666" }}>
        合計 <b>{all.length}</b> 件（表示中 {filtered.length} 件）
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px", gap: 10, margin: "14px 0 18px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="検索（例：内野手、軽量、MIZUNO…）"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}>
          <option value="">カテゴリ（すべて）</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={brand} onChange={(e) => setBrand(e.target.value)} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}>
          <option value="">ブランド（すべて）</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <a href={`/products/${p.id}`} style={{ border: "1px solid #eee", borderRadius: 16, overflow: "hidden", display: "block", boxShadow: "0 4px 18px rgba(0,0,0,.04)" }}>
      <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", height: 180, objectFit: "cover", display: "block", background: "#f6f6f6" }} />
      <div style={{ padding: 14, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ border: "1px solid #eee", borderRadius: 999, padding: "6px 10px", fontSize: 12, background: "#fafafa" }}>{p.category}</span>
          <span style={{ border: "1px solid #eee", borderRadius: 999, padding: "6px 10px", fontSize: 12, background: "#fafafa" }}>{p.brand}</span>
        </div>
        <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{p.name}</div>
        <div style={{ color: "#666" }}>{p.summary}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 800 }}>{yen(p.price)}</span>
          <span style={{ color: "#666" }}>詳細 →</span>
        </div>
      </div>
    </a>
  );
}
