export const API_BASE_URL = "http://localhost:3002/api/";
export const MEDIA_BASE_URL = "http://localhost:3002/public/";

const fetchRequest = async (url, options = {}) => {
  console.log(`Fetching URL: ${url}`, options); // Log the URL and options

  try {
    // If body is an instance of FormData, do not set Content-Type header
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }), // Only set Content-Type if not FormData
        ...options.headers,
      },
    });

    // Store the response body once
    const data = await response.json();

    if (!response.ok) {
      // Handle error scenario
      console.error(data.message || "Something went wrong");
      throw new Error(data.message || "Error fetching data");
    }

    return data;
  } catch (error) {
    console.error("Fetch request failed:", error.message);
    throw error; // Re-throw the error to be handled by the calling code
  }
};

export const apiService = {
  public: {
    get: (url, config) =>
      fetchRequest(API_BASE_URL + url, { method: "GET", ...config }),
    post: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "POST",
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...config,
      }),
    patch: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "PATCH",
        body: data instanceof FormData ? data : JSON.stringify(data),
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
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...config,
      }),
    patch: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "PATCH",
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...config,
      }),
    delete: (url, data, config) =>
      fetchRequest(API_BASE_URL + url, {
        method: "DELETE",
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...config,
      }),
  },
};
