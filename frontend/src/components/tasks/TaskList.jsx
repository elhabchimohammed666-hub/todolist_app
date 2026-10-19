import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { EmptyState } from '../common/EmptyState';

export const TaskList = ({
  tasks,
  isLoading,
  isFiltered,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState onAction={onCreateNew} isFiltered={isFiltered} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
