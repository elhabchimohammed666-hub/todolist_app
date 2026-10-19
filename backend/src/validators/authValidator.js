import { body } from 'express-validator';

export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Le nom d\'utilisateur est obligatoire')
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit comporter entre 3 et 30 caractères'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse email est obligatoire')
    .isEmail()
    .withMessage('Veuillez fournir une adresse email valide')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit comporter au moins 6 caractères'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse email est obligatoire')
    .isEmail()
    .withMessage('Veuillez fournir une adresse email valide'),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire'),
];
