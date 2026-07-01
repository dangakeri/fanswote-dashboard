import api from "./api";

class GiftService {
  list(params = {}) {
    return api.get(`/gifts${api.buildQuery(params)}`);
  }

  // POST /gifts { name, icon_url, animation_type, price }
  create(payload) {
    return api.post("/gifts", payload);
  }

  // PUT /gifts/:id { name?, icon_url?, animation_type?, price?, is_active? }
  update(id, payload) {
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
