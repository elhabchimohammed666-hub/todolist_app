import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdParamValidation,
  queryTasksValidation,
} from '../validators/taskValidator.js';
import { validate } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Appliquer l'authentification optionnelle sur l'ensemble des routes tâches
router.use(optionalAuth);

// Routes statistiques
router.get('/stats', getTaskStats);

// Routes CRUD principales
router
  .route('/')
  .get(queryTasksValidation, validate, getTasks)
  .post(writeLimiter, createTaskValidation, validate, createTask);

router
  .route('/:id')
  .get(taskIdParamValidation, validate, getTaskById)
  .put(writeLimiter, updateTaskValidation, validate, updateTask)
  .delete(writeLimiter, taskIdParamValidation, validate, deleteTask);

export default router;
