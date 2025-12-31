import { getProductById, getProducts } from "@/lib/products";
import { notFound } from "next/navigation";

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;   // ← ここが重要
  const p = getProductById(id);

  if (!p) return notFound();

  return (
    <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
      <p style={{ color: "#666" }}>
        <a href="/">← 商品一覧へ戻る</a>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 18 }}>
        <div>
          <img
            src={p.image}
            alt={p.name}
            style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 16, border: "1px solid #eee" }}
          />
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ border: "1px solid #eee", borderRadius: 999, padding: "6px 10px", fontSize: 12, background: "#fafafa" }}>{p.category}</span>
            <span style={{ border: "1px solid #eee", borderRadius: 999, padding: "6px 10px", fontSize: 12, background: "#fafafa" }}>{p.brand}</span>
          </div>

          <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>{p.name}</h1>
          <p style={{ color: "#666", marginTop: 0 }}>{p.summary}</p>

          <p style={{ fontWeight: 800, fontSize: 20 }}>{yen(p.price)}</p>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <a
              href={p.buyUrl}
              target="_blank"
              rel="noreferrer"
              style={{ padding: "10px 12px", borderRadius: 12, background: "#111", color: "#fff", border: "1px solid #ddd" }}
            >
              購入ページへ
            </a>
            <a href="/" style={{ padding: "10px 12px", borderRadius: 12, background: "#fff", color: "#111", border: "1px solid #ddd" }}>
              一覧へ
            </a>
          </div>

          <h2 style={{ fontSize: 16, margin: "16px 0 6px" }}>特徴</h2>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
