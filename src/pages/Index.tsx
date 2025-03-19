
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import TaskFilter from '@/components/TaskFilter';
import { Task } from '@/components/TaskItem';
import { CheckCheck, ListTodo } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    try {
      const parsedTasks = saved ? JSON.parse(saved) : [];
      // Convert string dates back to Date objects
      return parsedTasks.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        // Ensure status property exists for backward compatibility
        status: task.status || (task.completed ? 'completed' : 'todo')
      }));
    } catch (e) {
      console.error('Error parsing saved tasks', e);
      return [];
    }
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Count tasks by status
  const taskCount = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  // Load tasks from localStorage on mount
  useEffect(() => {
    // Simulate loading to show animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, dueDate?: Date | null) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      status: 'todo',
      dueDate: dueDate || null
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    toast({
      description: "Task added successfully",
      duration: 2000,
    });
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed,
              // Update status to match the completed state
              status: !task.completed ? 'completed' : task.status === 'completed' ? 'todo' : task.status
            } 
          : task
      )
    );
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              status,
              // Update completed state to match status
              completed: status === 'completed'
            } 
          : task
      )
    );
    
    toast({
      description: `Task marked as ${status.replace('-', ' ')}`,
      duration: 2000,
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      description: "Task deleted",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50">
      <div 
        className={`w-full max-w-md transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <header className="flex flex-col items-center mb-6 animate-slide-down">
          <div className="flex items-center justify-center w-12 h-12 mb-4 bg-todo-accent rounded-full text-white">
            <ListTodo size={24} />
          </div>
          <h1 className="text-2xl font-medium text-todo-text">Minimalist Tasks</h1>
          <p className="text-gray-500 mt-1">Simple and elegant task management</p>
        </header>

        <div className="depth-container overflow-hidden mb-4">
          <div className="p-4">
            <TaskInput onAddTask={addTask} />
          </div>
          
          <TaskList 
            tasks={tasks} 
            filter={filter}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
            onUpdateStatus={updateTaskStatus}
          />
          
          {tasks.length > 0 && (
            <div className="flex justify-center py-3 border-t border-todo-divider/50">
              <button
                onClick={() => {
                  if (taskCount.completed > 0) {
                    setTasks(prev => prev.filter(task => !task.completed));
                    toast({
                      description: `${taskCount.completed} completed ${taskCount.completed === 1 ? 'task' : 'tasks'} cleared`,
                      duration: 2000,
                    });
                  }
                }}
                className="text-sm text-gray-500 hover:text-todo-accent flex items-center gap-1 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={taskCount.completed === 0}
              >
                <CheckCheck size={14} />
                <span>Clear completed</span>
              </button>
            </div>
          )}
        </div>
        
        {tasks.length > 0 && (
          <TaskFilter 
            filter={filter} 
            onFilterChange={setFilter}
            taskCount={taskCount}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
