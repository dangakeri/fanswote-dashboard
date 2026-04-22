import api from "./api";

class QuickieService {
  // Admin moderation
  getAll(params = {}) {
    return api.get(`/quickies/admin/all${api.buildQuery(params)}`);
  }

  approve(id) {
    return api.put(`/quickies/admin/${id}/approve`);
  }

  reject(id) {
    return api.put(`/quickies/admin/${id}/reject`);
  }
}

export default new QuickieService();
