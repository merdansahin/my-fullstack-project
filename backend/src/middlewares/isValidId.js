import createHttpError from "http-errors";
import mongoose from "mongoose";

export const isValidId = (req, res, next) => {
  const { id, contactId } = req.params;

  if (!mongoose.isValidObjectId(id || contactId)) {
    next(createHttpError(400, "Geçersiz ID"));
    return;
  }

  next();
};
