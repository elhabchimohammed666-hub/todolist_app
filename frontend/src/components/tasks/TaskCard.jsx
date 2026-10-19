import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  Tag,
  AlertCircle,
} from 'lucide-react';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isDone = task.status === 'Terminée';
  const isInProgress = task.status === 'En cours';

  // Calcul du retard d'échéance
  const isOverdue =
    task.dueDate &&
    !isDone &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  // Formatage de la date d'échéance
  const formattedDueDate = task.dueDate
    ? new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(task.dueDate))
    : null;

  // Couleurs et badges de priorité
  const priorityStyles = {
    Haute: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-900/60',
      dot: 'bg-rose-500',
    },
    Moyenne: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-900/60',
      dot: 'bg-amber-500',
    },
    Basse: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  }[task.priority || 'Moyenne'];

  // Cycle de statut rapide au clic sur le bouton d'action
  const handleToggleNextStatus = () => {
    let nextStatus = 'À faire';
    if (task.status === 'À faire') nextStatus = 'En cours';
    else if (task.status === 'En cours') nextStatus = 'Terminée';
    else if (task.status === 'Terminée') nextStatus = 'À faire';

    onStatusChange(task._id, nextStatus);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isDone
          ? 'border-slate-200/60 dark:border-slate-800/60 opacity-80 bg-slate-50/50 dark:bg-slate-900/50'
          : isOverdue
          ? 'border-rose-200 dark:border-rose-900/60'
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50'
      }`}
    >
      <div>
        {/* Entête de carte : Statut & Priorité */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Badge de Priorité */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyles.dot}`} />
            {task.priority}
          </span>

          {/* Badge de Statut interactif */}
          <button
            onClick={handleToggleNextStatus}
            title="Cliquer pour changer le statut"
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              isDone
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : isInProgress
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : isInProgress ? (
              <Clock className="w-3.5 h-3.5" />
            ) : (
              <Circle className="w-3.5 h-3.5" />
            )}
            <span>{task.status}</span>
          </button>
        </div>

        {/* Titre & Description */}
        <h4
          className={`text-base font-bold text-slate-800 dark:text-slate-100 transition-all ${
            isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p
            className={`mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 ${
              isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <Tag className="w-2.5 h-2.5 mr-1 opacity-70" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pied de carte : Échéance + Actions rapides */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {/* Échéance */}
        {formattedDueDate ? (
          <div
            className={`inline-flex items-center text-xs font-medium ${
              isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 mr-1 stroke-[2.2]" />
            ) : (
              <Calendar className="w-3.5 h-3.5 mr-1" />
            )}
            <span>{formattedDueDate}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-600">Aucune date</div>
        )}

        {/* Boutons Éditer / Supprimer */}
        <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            aria-label="Modifier la tâche"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            aria-label="Supprimer la tâche"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
