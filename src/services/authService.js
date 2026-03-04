import api from "./api";

class AuthService {
  async login(email, password) {
    const data = await api.publicPost("/auth/login", { email, password });

    // Store user + token together
    api.setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });

    return data;
  }

  logout() {
    api.clearUser();
  }

  getUser() {
    return api.user;
  }

  isAuthenticated() {
    return api.isAuthenticated();
  }
}

export default new AuthService();
