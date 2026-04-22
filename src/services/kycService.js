import api from "./api";

class KycService {
  // Admin review
  getSubmissions(params = {}) {
    return api.get(`/kyc/all${api.buildQuery(params)}`);
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
