import React from 'react';
import { ClipboardList, PlusCircle } from 'lucide-react';

export const EmptyState = ({ onAction, isFiltered }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {isFiltered ? 'Aucune tâche ne correspond à vos filtres' : 'Aucune tâche pour le moment'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {isFiltered
          ? 'Essayez de modifier votre recherche ou de réinitialiser vos filtres de statut et priorité.'
          : 'Planifiez vos objectifs, organisez votre journée et gardez une trace de vos priorités facilement.'}
      </p>

      {!isFiltered && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Créer ma première tâche</span>
        </button>
      )}
    </div>
  );
};
