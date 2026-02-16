const errorHandler = (err, req, res, next) => {
  console.error("=== SUNUCU HATASI ===");
  console.error(err); // Hata detayını tam olarak yazdır

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Sunucu Hatası";

  // Mongoose Validation Hatası
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose Duplicate Key (Tekrarlayan Kayıt) Hatası
  if (err.code === 11000) {
    statusCode = 400;
    message = "Bu kayıt zaten mevcut (Duplicate field value entered)";
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
