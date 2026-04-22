import api from "./api";

class UserService {
  // Admin-only endpoints
  getUsers(params = {}) {
    return api.get(`/auth/all-users${api.buildQuery(params)}`);
  }

  updateRole(id, role) {
    return api.put(`/auth/update-role/${id}`, { role });
  }

  deleteUser(id) {
    return api.delete(`/auth/delete-user/${id}`);
  }
}

export default new UserService();
