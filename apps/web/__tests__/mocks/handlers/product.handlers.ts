import { http, HttpResponse } from "msw";

import { mockProducts } from "../data/products";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const productHandlers = [
  http.get(`${BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const size = Number(url.searchParams.get("size")) || 20;
    const search = (url.searchParams.get("search") || "").toLowerCase();

    const filtered = search
      ? mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.productId.toLowerCase().includes(search)
        )
      : mockProducts;

    const start = (page - 1) * size;
    const data = filtered.slice(start, start + size);

    return HttpResponse.json({
      data,
      meta: {
        page,
        size,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size))
      }
    });
  })
];
