export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl}`);
  res.status(500).json({ message: "Server Error", error: err.message });
};
