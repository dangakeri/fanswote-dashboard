import api from "./api";

// Payouts admin — /payouts/admin/*
// Each completed payout deducts VAT 16% + processing 2% + platform 22%,
// booked to platform_earnings on completion.
class PayoutService {
  // --- Bank list ---
  listBanks() {
    return api.get("/payouts/admin/banks");
  }

  createBank(payload) {
    // { code, name, sort_order? }
    return api.post("/payouts/admin/banks", payload);
  }

  updateBank(code, payload) {
    // { name?, is_active?, sort_order? }
    return api.put(`/payouts/admin/banks/${code}`, payload);
  }

  deleteBank(code) {
    return api.delete(`/payouts/admin/banks/${code}`);
  }

  // --- Withdrawals queue ---
  listWithdrawals(params = {}) {
    // e.g. { status: "pending" }
    return api.get(`/payouts/admin/withdrawals${api.buildQuery(params)}`);
  }

  processWithdrawal(id) {
    // pending -> processing
    return api.post(`/payouts/admin/withdrawals/${id}/process`);
  }

  completeWithdrawal(id, payload = {}) {
    // { reference?, note? } -> completed (money sent)
    return api.post(`/payouts/admin/withdrawals/${id}/complete`, payload);
  }

  rejectWithdrawal(id, payload = {}) {
    // { note? } -> rejected + refund
    return api.post(`/payouts/admin/withdrawals/${id}/reject`, payload);
  }
}

export default new PayoutService();
