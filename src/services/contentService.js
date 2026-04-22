import api from "./api";

class ContentService {
  // Admin moderation
  getPosts(params = {}) {
    return api.get(`/posts/admin/all${api.buildQuery(params)}`);
  }

  approvePost(id) {
    return api.put(`/posts/admin/${id}/approve`);
  }

  rejectPost(id, reason) {
    return api.put(`/posts/admin/${id}/reject`, { reason });
  }
}

export default new ContentService();
