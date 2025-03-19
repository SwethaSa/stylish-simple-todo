
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle);
      setTaskTitle('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative group animate-fade-in"
    >
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Add a new task..."
        className="w-full px-4 py-3 pr-12 text-todo-text placeholder-gray-400/70 bg-white border border-todo-divider/50 rounded-xl shadow-sm transition-all duration-200 focus:border-todo-accent custom-focus"
        aria-label="Add a new task"
      />
      <button
        type="submit"
        disabled={!taskTitle.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 bg-todo-accent text-white opacity-90 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Add task"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default TaskInput;
