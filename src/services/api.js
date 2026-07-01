import BaseClass from "./BaseClass";

const API_BASE = "https://fanswote.warcare.org.uk";

class ApiClient extends BaseClass {
  get baseUrl() {
    return API_BASE;
  }

  buildQuery(params = {}) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const qs = new URLSearchParams(clean).toString();
    return qs ? `?${qs}` : "";
  }

  async request(endpoint, options = {}) {
    const { method = "GET", body, headers = {}, skipAuth = false } = options;

    const config = {
      method,
      headers: {
        ...(skipAuth ? { "Content-Type": "application/json" } : this.authHeaders),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Only auto-redirect on 401 for authenticated requests
    if (res.status === 401 && !skipAuth) {
      this.clearUser();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }

    return data;
  }

  async upload(endpoint, formData, method = "POST") {
    const headers = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: formData,
    });

    if (res.status === 401) {
      this.clearUser();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || `Upload failed with status ${res.status}`);
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  publicGet(endpoint) {
    return this.request(endpoint, { skipAuth: true });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: "POST", body });
  }

  publicPost(endpoint, body) {
    return this.request(endpoint, { method: "POST", body, skipAuth: true });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: "PUT", body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: "PATCH", body });
  }

  delete(endpoint, body) {
    return this.request(endpoint, { method: "DELETE", body });
  }
}

const api = new ApiClient();
export default api;
