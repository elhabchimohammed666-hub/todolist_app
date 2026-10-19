import { validationResult } from 'express-validator';

/**
 * Middleware qui intercepte les erreurs de validation d'express-validator
 * et renvoie une réponse HTTP 400 structurée.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Erreur de validation des données transmises',
      errors: formattedErrors,
    });
  }
  next();
};
