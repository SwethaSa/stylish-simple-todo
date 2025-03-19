
import React from 'react';
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  taskCount: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ 
  filter, 
  onFilterChange,
  taskCount
}) => {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ] as const;

  return (
    <div className="flex items-center justify-center p-1 rounded-lg glass-effect mx-auto w-fit mt-4 animate-fade-in">
      {filters.map((item) => (
        <button
          key={item.value}
          onClick={() => onFilterChange(item.value)}
          className={cn(
            "px-4 py-2 text-sm rounded-md transition-all duration-200 relative",
            filter === item.value 
              ? "text-todo-accent font-medium" 
              : "text-gray-500 hover:text-gray-700"
          )}
          aria-label={`Show ${item.label.toLowerCase()} tasks`}
          aria-current={filter === item.value ? "page" : undefined}
        >
          {item.label}
          {taskCount[item.value] > 0 && (
            <span 
              className={cn(
                "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                filter === item.value 
                  ? "bg-todo-accent text-white" 
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {taskCount[item.value]}
            </span>
          )}
          {filter === item.value && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-todo-accent rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
