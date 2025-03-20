
import React from 'react';
import TaskItem, { Task } from './TaskItem';
import { AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onUpdateComments?: (id: string, comments: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  filter, 
  onToggleComplete, 
  onDeleteTask,
  onUpdateStatus,
  onUpdateComments
}) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 animate-fade-in">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400 animate-fade-in">
        <AlertCircle size={16} className="mr-2" />
        <p>No {filter} tasks found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onUpdateStatus={onUpdateStatus}
          onUpdateComments={onUpdateComments}
        />
      ))}
    </div>
  );
};

export default TaskList;
