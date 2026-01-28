import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Kullanıcı doğrulama (DB kontrolü)
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ user, accessToken, refreshToken });
});
// Refresh tokenları DB veya memory'de tutabilirsin
let refreshTokens = [];

router.post("/login", (req, res) => {
  // login sırasında refreshToken oluşturulup listeye eklenir
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  // Refresh token listeden silinir
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
