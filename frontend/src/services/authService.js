import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (userData) => {
  try {
    console.log("Sending registration request:", userData);

    // axiosInstance, temel URL'yi ve JSON için content-type başlıklarını yönetir.
    // Backend'deki doğru endpoint: /api/users/register
    const { data } = await axiosInstance.post("/users/register", userData);

    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";
    console.error("Registration service error:", errorMessage);
    // Kullanıcıya gösterilebilecek bir hata fırlat
    throw new Error(errorMessage);
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await axiosInstance.post("/users/login", credentials);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    console.error("Login service error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const logoutUser = async () => {
  // Backend logout işlemi state-less olsa da, API'yi çağırmak iyi bir pratiktir.
  await axiosInstance.post("/users/logout").catch((error) => {
    console.error(
      "Logout API call failed, proceeding with client-side logout:",
      error.message,
    );
  });

  // Her durumda local storage'ı temizle
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Not: Orijinal dosyadaki testConnection fonksiyonu, var olmayan bir '/health'
// endpoint'ini çağırdığı için kaldırılmıştır.
