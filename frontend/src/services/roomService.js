import api from "../api/axios"; // axios instance

export const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data; // odaları döndür
  } catch (error) {
    if (error.response) {
      // Sunucu cevap verdi ama hata kodu döndü (örneğin 404, 500)
      console.error("Sunucu hatası:", error.response.data);
    } else if (error.request) {
      // İstek gönderildi ama cevap alınamadı
      console.error("Sunucuya ulaşılamıyor:", error.message);
    } else {
      // İstek gönderilemedi (axios config hatası vs.)
      console.error("İstek yapılamadı:", error.message);
    }
    return []; // hata durumunda boş dizi döndür
  }
};
