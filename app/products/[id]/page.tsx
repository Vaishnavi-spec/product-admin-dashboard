"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../../lib/productApi";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

          <p className="text-gray-600">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mb-6 text-gray-500">
            The product you are looking for does not exist.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/products")}
            className="rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Products
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Product */}

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Images */}

            <div>
              <div className="mb-4 flex h-96 items-center justify-center rounded-xl bg-gray-50 p-6">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.images?.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="flex h-24 items-center justify-center rounded-lg bg-gray-50 p-2"
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}

            <div>
              <p className="mb-2 text-sm font-medium uppercase text-blue-600">
                {product.category}
              </p>

              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm">
                  ⭐ {product.rating}
                </span>
              </div>

              <p className="mb-6 leading-7 text-gray-600">
                {product.description}
              </p>

              <div className="mb-8 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Stock
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {product.stock} units available
                </p>
              </div>

              {/* Reviews */}

              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Reviews
                </h2>

                {product.reviews &&
                product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {review.reviewerName}
                          </span>

                          <span className="text-sm">
                            ⭐ {review.rating}
                          </span>
                        </div>

                        <p className="text-gray-600">
                          {review.comment}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(
                            review.date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No reviews available.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}