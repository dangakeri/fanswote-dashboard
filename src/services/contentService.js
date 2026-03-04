import api from "./api";

class ContentService {
  getContent(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/content${query ? `?${query}` : ""}`);
  }

  getContentById(id) {
    return api.get(`/admin/content/${id}`);
  }

  approveContent(id) {
    return api.patch(`/admin/content/${id}/approve`);
  }

  removeContent(id) {
    return api.delete(`/admin/content/${id}`);
  }
}

export default new ContentService();
