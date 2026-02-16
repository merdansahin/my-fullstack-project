import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl}`);
  res.status(500).json({ message: "Sunucu Hatası", error: err.message });
};
