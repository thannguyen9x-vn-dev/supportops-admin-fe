import type { Product, ProductDraft } from "./projects.types";

const INITIAL_PRODUCTS: Product[] = [
  { id: "194856", name: "Education Dashboard", technology: "Angular", price: 149, status: "active", updatedAt: "2026-01-03T09:20:00.000Z" },
  { id: "623323", name: "React UI Kit", technology: "React JS", price: 129, status: "active", updatedAt: "2026-01-05T11:15:00.000Z" },
  { id: "912457", name: "Coworking Template", technology: "Tailwind CSS", price: 49, status: "draft", updatedAt: "2026-01-07T07:10:00.000Z" },
  { id: "657670", name: "Glassmorphism Dashboard", technology: "Tailwind CSS", price: 79, status: "active", updatedAt: "2026-01-09T15:25:00.000Z" },
  { id: "194101", name: "Education Dashboard", technology: "Sketch", price: 39, status: "archived", updatedAt: "2026-01-11T08:00:00.000Z" },
  { id: "214345", name: "Business Dashboard", technology: "Figma", price: 249, status: "active", updatedAt: "2026-01-12T14:40:00.000Z" },
  { id: "194102", name: "Neumorphism UI", technology: "Laravel", price: 149, status: "draft", updatedAt: "2026-01-14T10:30:00.000Z" },
  { id: "194103", name: "SaaS Landing", technology: "Tailwind CSS", price: 79, status: "active", updatedAt: "2026-01-16T12:00:00.000Z" },
  { id: "194104", name: "Medical Multipurpose", technology: "Tailwind CSS", price: 79, status: "active", updatedAt: "2026-01-18T16:45:00.000Z" },
  { id: "194105", name: "App Kit", technology: "Bootstrap", price: 49, status: "archived", updatedAt: "2026-01-20T09:55:00.000Z" },
  { id: "355678", name: "Full Stack Bundle", technology: "Bootstrap", price: 69, status: "active", updatedAt: "2026-01-22T07:45:00.000Z" },
  { id: "345678", name: "Social Networking Template", technology: "Adobe XD", price: 59, status: "draft", updatedAt: "2026-01-24T13:10:00.000Z" },
  { id: "235676", name: "Restaurant Theme", technology: "WordPress", price: 59, status: "active", updatedAt: "2026-01-26T11:00:00.000Z" },
];

let productStore = [...INITIAL_PRODUCTS];

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createProductId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function mockFetchProducts(): Promise<Product[]> {
  await wait(350);
  return [...productStore];
}

export async function mockSaveProduct(draft: ProductDraft, productId?: string): Promise<Product> {
  await wait(420);
  const now = new Date().toISOString();

  if (productId) {
    const index = productStore.findIndex((item) => item.id === productId);
    if (index === -1) {
      throw new Error("Product not found");
    }

    const current = productStore[index];
    if (!current) {
      throw new Error("Product not found");
    }
    const updated: Product = {
      ...current,
      ...draft,
      updatedAt: now,
    };
    productStore[index] = updated;
    return updated;
  }

  const created: Product = {
    id: createProductId(),
    updatedAt: now,
    ...draft,
  };

  productStore = [created, ...productStore];
  return created;
}

export async function mockDeleteProducts(productIds: string[]): Promise<void> {
  await wait(320);
  const toDelete = new Set(productIds);
  productStore = productStore.filter((product) => !toDelete.has(product.id));
}
