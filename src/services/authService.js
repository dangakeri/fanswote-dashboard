import api from "./api";

class AuthService {
  async login(email, password) {
    const data = await api.publicPost("/auth/login", { email, password });

    api.setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });

    return data;
  }

  // Admin user management
  deleteUser(id) {
    return api.delete(`/auth/delete-user/${id}`);
  }

  updateRole(id, role) {
    return api.put(`/auth/update-role/${id}`, { role });
  }

  listAllUsers() {
    return api.get("/auth/all-users");
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
