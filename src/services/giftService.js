import api from "./api";

class GiftService {
  list(params = {}) {
    return api.get(`/gifts${api.buildQuery(params)}`);
  }

  create(payload) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, value);
    });
    return api.upload("/gifts", form, "POST");
  }

  update(id, payload) {
    const hasFile = payload.icon instanceof File;
    if (hasFile) {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) form.append(key, value);
      });
      return api.upload(`/gifts/${id}`, form, "PUT");
    }
    return api.put(`/gifts/${id}`, payload);
  }

  toggleActive(id, isActive) {
    return api.put(`/gifts/${id}`, { is_active: isActive });
  }

  remove(id) {
    return api.delete(`/gifts/${id}`);
  }
}

export default new GiftService();
