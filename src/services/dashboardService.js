import api from "./api";

class DashboardService {
  getStats() {
    return api.get("/admin/dashboard/stats");
  }

  getRevenueData() {
    return api.get("/admin/dashboard/revenue");
  }

  getUserGrowth() {
    return api.get("/admin/dashboard/user-growth");
  }

  getTopCreators() {
    return api.get("/admin/dashboard/top-creators");
  }

  getRecentActivity() {
    return api.get("/admin/dashboard/recent-activity");
  }
}

export default new DashboardService();
