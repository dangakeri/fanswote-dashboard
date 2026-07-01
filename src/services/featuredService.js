import api from "./api";

// Featuring / boosting (ads) admin — /featured/admin/* and /posts/admin/:id/feature.
// NOTE: the admin API doc lists only mutations for campaigns (no GET). listCampaigns()
// targets a conventional collection endpoint and callers should tolerate it 404ing.
class FeaturedService {
  // Feature a creator (charges them). body: { budget_tokens, ...targeting }
  grantCreator(creatorId, payload) {
    return api.post(`/featured/admin/${creatorId}/grant`, payload);
  }

  // Cancel a creator's active campaign (refund unspent)
  cancelCreator(creatorId) {
    return api.delete(`/featured/admin/${creatorId}`);
  }

  // Moderate any campaign
  pauseCampaign(id) {
    return api.post(`/featured/admin/campaigns/${id}/pause`);
  }

  resumeCampaign(id) {
    return api.post(`/featured/admin/campaigns/${id}/resume`);
  }

  // Cancel + refund any campaign
  cancelCampaign(id) {
    return api.post(`/featured/admin/campaigns/${id}/cancel`);
  }

  // Boost a post (charges its creator). body: { budget_tokens }
  featurePost(id, budgetTokens) {
    return api.post(`/posts/admin/${id}/feature`, { budget_tokens: budgetTokens });
  }

  // Best-effort listing (not guaranteed by the admin API doc)
  listCampaigns(params = {}) {
    return api.get(`/featured/admin/campaigns${api.buildQuery(params)}`);
  }
}

export default new FeaturedService();
