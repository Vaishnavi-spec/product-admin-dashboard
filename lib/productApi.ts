import api from "./axios";

export const getProducts = async (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string
) => {
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    },
  });

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string
) => {
  const response = await api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    },
  });

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string
) => {
  const response = await api.get(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
    }
  );

  return response.data;
};