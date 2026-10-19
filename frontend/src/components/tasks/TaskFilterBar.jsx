import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const TaskFilterBar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
}) => {
  const statusOptions = [
    { label: 'Toutes', value: 'all' },
    { label: 'À faire', value: 'À faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminée', value: 'Terminée' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 space-y-4 transition-colors">
      {/* Ligne 1 : Barre de recherche + Tris */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Champ de recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par titre, description ou tag..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sélecteurs de Tri et Priorité */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Filtre Priorité */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
            >
              <option value="all">Toutes priorités</option>
              <option value="Haute">Priorité Haute</option>
              <option value="Moyenne">Priorité Moyenne</option>
              <option value="Basse">Priorité Basse</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Critère de Tri */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
            >
              <option value="createdAt">Date de création</option>
              <option value="dueDate">Date d'échéance</option>
              <option value="priority">Niveau de priorité</option>
              <option value="title">Titre alphabétique</option>
            </select>
          </div>

          {/* Ordre Asc / Desc */}
          <button
            onClick={onOrderToggle}
            title={order === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className={`w-4 h-4 transition-transform ${order === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ligne 2 : Filtres de statut par onglets pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-2 shrink-0">
          Statut :
        </span>
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
