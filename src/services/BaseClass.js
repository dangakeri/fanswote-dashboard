const STORAGE_KEY = "dashboard-user";

class BaseClass {
  get user() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  get token() {
    return this.user?.token || null;
  }

  get userId() {
    return this.user?.id || null;
  }

  get userName() {
    return this.user?.name || null;
  }

  get userEmail() {
    return this.user?.email || null;
  }

  get userRole() {
    return this.user?.role || null;
  }

  get authHeaders() {
    return {
      Authorization: this.token ? `Bearer ${this.token}` : "",
      "Content-Type": "application/json",
    };
  }

  isTokenExpired() {
    if (!this.token) return true;
    try {
      const payload = JSON.parse(atob(this.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return now >= payload.exp;
    } catch {
      return true;
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.user && !this.isTokenExpired();
  }

  setUser(userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }

  clearUser() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default BaseClass;
