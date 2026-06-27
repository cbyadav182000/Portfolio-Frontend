export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-82ws.onrender.com";

export const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return null;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};
