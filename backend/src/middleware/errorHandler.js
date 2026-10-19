/**
 * Middleware de gestion des routes non trouvées (404)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ressource non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware centralisé de gestion globale des erreurs
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Une erreur interne est survenue sur le serveur';
  let errors = null;

  // 1. Erreur Mongoose : Mauvais format d'ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Identifiant invalide fourni pour le champ "${err.path}"`;
  }

  // 2. Erreur Mongoose : Échec de validation de schéma
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation du modèle échouée';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 3. Erreur Mongoose : Clé dupliquée (index unique)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `La valeur pour le champ "${field}" existe déjà`;
  }

  // 4. Erreur JSON mal formé dans la requête
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Format JSON invalide dans le corps de la requête';
  }

  // 5. Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token d\'authentification invalide';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token d\'authentification expiré';
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
