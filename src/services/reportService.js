import api from "./api";

class ReportService {
  // Admin review
  list(params = {}) {
    return api.get(`/reports${api.buildQuery(params)}`);
  }

  getById(id) {
    return api.get(`/reports/${id}`);
  }

  updateStatus(id, status, adminNotes) {
    return api.put(`/reports/${id}/status`, { status, adminNotes });
  }
}

export default new ReportService();
