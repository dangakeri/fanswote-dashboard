import api from "./api";

class ContentService {
  getPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/posts/admin/all${query ? `?${query}` : ""}`);
  }

  approvePost(id) {
    return api.put(`/posts/admin/${id}/approve`);
  }

  rejectPost(id, reason) {
    return api.put(`/posts/admin/${id}/reject`, { reason });
  }
}

export default new ContentService();
