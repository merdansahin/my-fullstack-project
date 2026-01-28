import React from "react";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
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
