import api from "./api";

// Platform-wide admin analytics — /admin/analytics/* (admin only).
// All token figures come back with a matching *_kes conversion (Ksh 1 = 10 tokens).
class AnalyticsService {
  overview() {
    return api.get("/admin/analytics/overview");
  }

  revenue(sinceDays = 30) {
    return api.get(`/admin/analytics/revenue${api.buildQuery({ since_days: sinceDays })}`);
  }

  withdrawals() {
    return api.get("/admin/analytics/withdrawals");
  }

  topCreators(limit = 10) {
    return api.get(`/admin/analytics/top-creators${api.buildQuery({ limit })}`);
  }

  signups(days = 30) {
    return api.get(`/admin/analytics/signups${api.buildQuery({ days })}`);
  }
}

export default new AnalyticsService();
