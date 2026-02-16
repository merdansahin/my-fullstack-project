import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "./redux/slices/userSlice";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü yap
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Token varsa kullanıcı bilgilerini getir
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          // Redux store'u güncelle
          dispatch(loginSuccess({ user: res.data, token }));
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem("token");
        }
      }
    };
    checkLoggedIn();
  }, [dispatch]);

  return (
    <div className="app-container">
      <Navbar />

      <main className="app-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
