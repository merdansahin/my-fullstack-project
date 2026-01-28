import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer">
      <p>© {new Date().getFullYear()} HotelBooking. All rights reserved.</p>
    </div>
  );
}

export default Footer;
