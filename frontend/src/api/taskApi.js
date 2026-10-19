import { axiosClient } from './axiosClient';

export const taskApi = {
  /**
   * Récupérer les tâches avec filtres et pagination
   */
  getTasks: (params = {}) => {
    return axiosClient.get('/tasks', { params });
  },

  /**
   * Récupérer les statistiques globales
   */
  getStats: () => {
    return axiosClient.get('/tasks/stats');
  },

  /**
   * Récupérer une tâche par son identifiant
   */
  getTaskById: (id) => {
    return axiosClient.get(`/tasks/${id}`);
  },

  /**
   * Créer une nouvelle tâche
   */
  createTask: (taskData) => {
    return axiosClient.post('/tasks', taskData);
  },

  /**
   * Mettre à jour une tâche
   */
  updateTask: ({ id, ...updateData }) => {
    return axiosClient.put(`/tasks/${id}`, updateData);
  },

  /**
   * Supprimer une tâche
   */
  deleteTask: (id) => {
    return axiosClient.delete(`/tasks/${id}`);
  },
};
