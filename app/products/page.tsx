"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  getProducts,
  searchProducts,
} from "../../lib/productApi";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

type SortField = "default" | "price" | "rating" | "stock";
type SortOrder = "asc" | "desc";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("default");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, search, category]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      if (Array.isArray(data)) {
        setCategories(
          data.map((item: any) =>
            typeof item === "string" ? item : item.name
          )
        );
      } else if (Array.isArray(data?.categories)) {
        setCategories(
          data.categories.map((item: any) =>
            typeof item === "string" ? item : item.name
          )
        );
      }
    } catch {
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const skip = (page - 1) * pageSize;

      let data;

      if (search.trim()) {
        data = await searchProducts(search.trim(), pageSize, skip);
      } else {
        data = await getProducts(pageSize, skip);
      }

      let productList: Product[] = data?.products || [];
      let productTotal = data?.total || 0;

      if (category) {
        productList = productList.filter(
          (product) =>
            product.category.toLowerCase() === category.toLowerCase()
        );

        if (!search.trim()) {
          const allData = await getProducts(194, 0);

          const allProducts: Product[] = allData?.products || [];

          productTotal = allProducts.filter(
            (product) =>
              product.category.toLowerCase() === category.toLowerCase()
          ).length;

          productList = allProducts
            .filter(
              (product) =>
                product.category.toLowerCase() === category.toLowerCase()
            )
            .slice(skip, skip + pageSize);
        }
      }

      setProducts(productList);
      setTotal(productTotal);
    } catch (err: any) {
      setProducts([]);
      setTotal(0);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "default") {
      return result;
    }

    result.sort((a, b) => {
      let valueA = 0;
      let valueB = 0;

      if (sortBy === "price") {
        valueA = a.price;
        valueB = b.price;
      }

      if (sortBy === "rating") {
        valueA = a.rating;
        valueB = b.rating;
      }

      if (sortBy === "stock") {
        valueA = a.stock;
        valueB = b.stock;
      }

      return sortOrder === "asc"
        ? valueA - valueB
        : valueB - valueA;
    });

    return result;
  }, [products, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortBy = (value: SortField) => {
    setSortBy(value);

    if (value === "default") {
      setSortOrder("asc");
    }

    setPage(1);
  };

  const handleSortOrder = (value: SortOrder) => {
    setSortOrder(value);
    setPage(1);
  };

  const handlePageSize = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    router.replace("/login");
  };

  const handleProductClick = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Product Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your products
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-7 py-4 text-lg font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-7 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="h-14 w-full rounded-xl border border-gray-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => handleCategory(e.target.value)}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Categories</option>

                {categories.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortBy(e.target.value as SortField)
                }
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="default">Default</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Order
              </label>

              <select
                value={sortOrder}
                onChange={(e) =>
                  handleSortOrder(e.target.value as SortOrder)
                }
                disabled={sortBy === "default"}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-7 py-6 text-left text-lg font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-7 py-6 text-left text-lg font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-7 py-6 text-left text-lg font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-7 py-6 text-left text-lg font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="px-7 py-6 text-left text-lg font-semibold text-gray-700">
                    Stock
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-7 py-16 text-center text-lg text-gray-500"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-7 py-16 text-center text-lg text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : sortedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-7 py-16 text-center text-lg text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer border-b border-gray-200 transition hover:bg-gray-50"
                    >
                      <td className="px-7 py-6">
                        <div className="flex items-center gap-5">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <span className="text-lg font-medium text-gray-900">
                            {product.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-7 py-6 text-lg capitalize text-gray-700">
                        {product.category}
                      </td>

                      <td className="px-7 py-6 text-lg font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="px-7 py-6">
                        <div className="flex items-center gap-2 text-lg">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-400">
                            {product.rating}
                          </span>
                        </div>
                      </td>

                      <td className="px-7 py-6 text-lg text-gray-700">
                        {product.stock}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-5 border-t border-gray-200 px-7 py-6 md:flex-row md:items-center md:justify-between">
            <div className="text-lg text-gray-600">
              Showing{" "}
              {total === 0 ? 0 : (page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)} of {total}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg text-gray-600">Page size:</span>

              <select
                value={pageSize}
                onChange={(e) =>
                  handlePageSize(Number(e.target.value))
                }
                className="h-12 rounded-xl border border-gray-300 bg-white px-4 text-lg outline-none focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                className="rounded-xl border border-gray-300 px-5 py-3 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-12 min-w-12 rounded-xl px-4 text-lg transition ${
                    page === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages}
                className="rounded-xl border border-gray-300 px-5 py-3 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}