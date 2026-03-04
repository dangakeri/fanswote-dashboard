import api from "./api";

class KycService {
  getSubmissions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/kyc/all${query ? `?${query}` : ""}`);
  }

  getSubmissionById(id) {
    return api.get(`/kyc/${id}`);
  }

  approveSubmission(id) {
    return api.put(`/kyc/${id}/approve`);
  }

  rejectSubmission(id, reason) {
    return api.put(`/kyc/${id}/reject`, { reason });
  }
}

export default new KycService();
