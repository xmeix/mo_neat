const API_BASE_URL = "http://localhost:3002/api/";

const fetchRequest = async (url, options = {}) => {
  console.log(`Fetching URL: ${url}`, options); // Log the URL and options

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    console.log("Fetch request failed:", error.message);
    throw error;
  }
};

export const apiService = {
  public: {
    get: (url, config) =>
      fetchRequest(API_BASE_URL + url, { method: "GET", ...config }),
    post: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "POST",
        body: JSON.stringify(data),
        ...config,
      }),
    patch: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "PATCH",
        body: JSON.stringify(data),
        ...config,
      }),
    delete: (url, config) =>
      fetchRequest(API_BASE_URL + url, { method: "DELETE", ...config }),
  },
  admin: {
    get: (url, config) =>
      fetchRequest(API_BASE_URL + url, { method: "GET", ...config }),
    post: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "POST",
        body: JSON.stringify(data),
        ...config,
      }),
    patch: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "PATCH",
        body: JSON.stringify(data),
        ...config,
      }),
    delete: (url, config) =>
      fetchRequest(API_BASE_URL + url, { method: "DELETE", ...config }),
  },
};
