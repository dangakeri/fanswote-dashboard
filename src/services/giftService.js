import api from "./api";

class GiftService {
  getGifts() {
    return api.get("/gifts");
  }

  createGift(data) {
    return api.post("/gifts", data);
  }
}

export default new GiftService();
