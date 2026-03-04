import BaseClass from "./BaseClass";

const API_BASE = "https://api.fanswote.com";

class ApiClient extends BaseClass {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint);
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

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient();
export default api;
