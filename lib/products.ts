import products from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  summary: string;
  features: string[];
  buyUrl: string;
};

export function getProducts(): Product[] {
  return products as Product[];
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getUnique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
