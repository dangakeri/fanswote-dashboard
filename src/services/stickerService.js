import api from "./api";

// Stickers catalog admin — /messages/stickers/*
class StickerService {
  listPacks(params = {}) {
    return api.get(`/messages/stickers/packs${api.buildQuery(params)}`);
  }

  // multipart: { name, ...meta, cover: File }
  createPack(payload) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, value);
    });
    return api.upload("/messages/stickers/packs", form, "POST");
  }

  deletePack(packId) {
    return api.delete(`/messages/stickers/packs/${packId}`);
  }

  // multipart: { name?, ...meta, image: File }
  addSticker(packId, payload) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, value);
    });
    return api.upload(`/messages/stickers/packs/${packId}/stickers`, form, "POST");
  }

  deleteSticker(id) {
    return api.delete(`/messages/stickers/${id}`);
  }
}

export default new StickerService();
