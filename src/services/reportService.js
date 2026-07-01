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
    // API expects snake_case admin_notes per the admin API spec
    return api.put(`/reports/${id}/status`, { status, admin_notes: adminNotes });
  }
}

export default new ReportService();
