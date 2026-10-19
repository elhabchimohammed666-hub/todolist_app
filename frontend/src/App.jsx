import React, { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { TaskStats } from './components/tasks/TaskStats';
import { TaskFilterBar } from './components/tasks/TaskFilterBar';
import { TaskList } from './components/tasks/TaskList';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { useDebounce } from './hooks/useDebounce';
import {
  useTasksQuery,
  useTaskStatsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from './hooks/useTasks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Dashboard() {
  // États de recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // État du formulaire modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Construction des paramètres de requête API
  const queryParams = useMemo(() => {
    const params = {
      sortBy,
      order,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    return params;
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, order]);

  // Requêtes React Query
  const { data: tasksResponse, isLoading: isTasksLoading } = useTasksQuery(queryParams);
  const { data: statsResponse, isLoading: isStatsLoading } = useTaskStatsQuery();

  // Mutations React Query
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const tasks = tasksResponse?.data || [];
  const stats = statsResponse?.data;

  // Gestionnaires d'événements
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitModal = (formData) => {
    if (editingTask) {
      updateTaskMutation.mutate(
        { id: editingTask._id, ...formData },
        {
          onSuccess: () => handleCloseModal(),
        }
      );
    } else {
      createTaskMutation.mutate(formData, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleOrderToggle = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const isFiltered = Boolean(debouncedSearch || statusFilter !== 'all' || priorityFilter !== 'all');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700 shadow-xl rounded-2xl',
        }}
      />

      {/* Barre de navigation */}
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      {/* Conteneur principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé des indicateurs clés (Stats) */}
        <TaskStats stats={stats} isLoading={isStatsLoading} />

        {/* Barre de filtres, recherche et tri */}
        <TaskFilterBar
          search={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          order={order}
          onOrderToggle={handleOrderToggle}
        />

        {/* Grille des tâches */}
        <TaskList
          tasks={tasks}
          isLoading={isTasksLoading}
          isFiltered={isFiltered}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onCreateNew={handleOpenCreateModal}
        />

        {/* Modal de création / édition */}
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          initialTask={editingTask}
          isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
