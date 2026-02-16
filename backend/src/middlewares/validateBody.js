import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    next();
  } catch (err) {
    next(createHttpError(400, err.errors?.join(", ") || "Doğrulama hatası"));
  }
};
