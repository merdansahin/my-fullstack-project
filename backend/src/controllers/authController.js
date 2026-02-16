import {
  registerUserService,
  loginUserService,
  getUserProfileService,
  refreshUserTokenService,
} from "../services/auth.js";

// Register
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { user, accessToken } = await registerUserService({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token: accessToken, // Frontend için token eklendi
      accessToken,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    // Diğer tüm hataları merkezi hata yöneticisine gönder
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { user, accessToken, refreshToken } = await loginUserService({
      email,
      password,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: accessToken, // Frontend uyumluluğu için eklendi
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Diğer tüm hataları merkezi hata yöneticisine gönder
    next(error);
  }
};

// Logout
export const logout = (req, res) => {
  // Note: This is a stateless logout. For a stateful one, you'd manage a token blacklist.
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Profile
export const getProfile = async (req, res) => {
  const user = await getUserProfileService(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const { accessToken } = await refreshUserTokenService(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    if (
      error.message === "No refresh token provided" ||
      error.message === "User not found"
    ) {
      return res.status(401).json({ message: error.message });
    }

    next(error);
  }
};
