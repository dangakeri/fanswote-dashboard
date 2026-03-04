import api from "./api";

class UserService {
  getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/auth/all-users${query ? `?${query}` : ""}`);
  }

  updateRole(id, role) {
    return api.put(`/auth/update-role/${id}`, { role });
  }
}

export default new UserService();
