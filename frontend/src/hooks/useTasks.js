import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskApi } from '../api/taskApi';

/**
 * Récupération paginée et filtrée des tâches
 */
export const useTasksQuery = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
    staleTime: 1000 * 60, // 1 minute de mise en cache
    keepPreviousData: true,
  });
};

/**
 * Récupération des statistiques globales
 */
export const useTaskStatsQuery = () => {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: () => taskApi.getStats(),
    staleTime: 1000 * 30,
  });
};

/**
 * Mutation : Création d'une tâche
 */
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTaskData) => taskApi.createTask(newTaskData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      toast.success(response.message || 'Tâche créée avec succès !', {
        icon: '✨',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Impossible de créer la tâche');
    },
  });
};

/**
 * Mutation : Mise à jour d'une tâche
 */
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => taskApi.updateTask({ id, ...data }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      toast.success(response.message || 'Tâche mise à jour !', {
        icon: '🔄',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la tâche');
    },
  });
};

/**
 * Mutation : Suppression d'une tâche
 */
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => taskApi.deleteTask(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      toast.success('Tâche supprimée avec succès', {
        icon: '🗑️',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Échec de la suppression de la tâche');
    },
  });
};
