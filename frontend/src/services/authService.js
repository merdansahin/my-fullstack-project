import fetch from "node-fetch";
const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  try {
    console.log("Sending registration request:", userData);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

// Test fonksiyonu
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error("Connection test failed:", error);
    throw error;
  }
};
