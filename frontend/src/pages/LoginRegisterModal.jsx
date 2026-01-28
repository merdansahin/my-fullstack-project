import { useState } from "react";
import "./styles/global.css";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // login veya register

  return (
    <div>
      <button
        onClick={() => {
          setMode("login");
          setOpen(true);
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          setMode("register");
          setOpen(true);
        }}
      >
        Register
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>
              ×
            </button>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
            <form>
              {mode === "register" && (
                <input type="text" placeholder="Name" required />
              )}
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">
                {mode === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
