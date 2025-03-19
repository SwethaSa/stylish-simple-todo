
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDeleteTask 
}) => {
  return (
    <div 
      className={cn(
        "todo-item group flex items-center justify-between px-4 py-3 border-b border-todo-divider/50 animate-slide-up",
        task.completed && "completed"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            "task-checkbox flex-shrink-0",
            task.completed && "checked"
          )}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <Check 
              size={14} 
              className="text-white animate-check-mark" 
              style={{ 
                strokeDasharray: "20", 
                strokeDashoffset: "0" 
              }} 
            />
          )}
        </button>
        <span className="todo-text transition-all duration-200">{task.title}</span>
      </div>
      
      <button
        onClick={() => onDeleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-destructive"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TaskItem;
