import { body, param, query } from 'express-validator';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est obligatoire')
    .isLength({ min: 2, max: 120 })
    .withMessage('Le titre doit contenir entre 2 et 120 caractères'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères'),

  body('status')
    .optional()
    .isIn(['À faire', 'En cours', 'Terminée'])
    .withMessage('Le statut doit être: "À faire", "En cours" ou "Terminée"'),

  body('priority')
    .optional()
    .isIn(['Basse', 'Moyenne', 'Haute'])
    .withMessage('La priorité doit être: "Basse", "Moyenne" ou "Haute"'),

  body('dueDate')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true;
      if (isNaN(Date.parse(val))) {
        throw new Error("La date d'échéance doit être une date valide");
      }
      return true;
    }),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Les tags doivent être fournis sous forme de tableau'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Chaque tag ne peut excéder 30 caractères'),
];

export const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Identifiant de tâche invalide (ObjectId attendu)'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Le titre doit contenir entre 2 et 120 caractères'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères'),

  body('status')
    .optional()
    .isIn(['À faire', 'En cours', 'Terminée'])
    .withMessage('Le statut doit être: "À faire", "En cours" ou "Terminée"'),

  body('priority')
    .optional()
    .isIn(['Basse', 'Moyenne', 'Haute'])
    .withMessage('La priorité doit être: "Basse", "Moyenne" ou "Haute"'),

  body('dueDate')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true;
      if (isNaN(Date.parse(val))) {
        throw new Error("La date d'échéance doit être une date valide");
      }
      return true;
    }),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Les tags doivent être fournis sous forme de tableau'),
];

export const taskIdParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Identifiant de tâche invalide (ObjectId attendu)'),
];

export const queryTasksValidation = [
  query('status')
    .optional()
    .isIn(['À faire', 'En cours', 'Terminée', 'all'])
    .withMessage('Statut de filtre invalide'),

  query('priority')
    .optional()
    .isIn(['Basse', 'Moyenne', 'Haute', 'all'])
    .withMessage('Priorité de filtre invalide'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'dueDate', 'priority', 'title'])
    .withMessage('Champ de tri non autorisé'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordre de tri: "asc" ou "desc"'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier supérieur ou égal à 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite par page doit être comprise entre 1 et 100'),
];
