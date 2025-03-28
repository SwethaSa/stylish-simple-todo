import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import TaskFilter from '@/components/TaskFilter';
import { Task } from '@/components/TaskItem';
import { CheckCheck, ListTodo, Star, Rocket, Sparkles, GlassWater } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { requestNotificationPermission, scheduleNotification } from '@/services/notificationService';

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    try {
      const parsedTasks = saved ? JSON.parse(saved) : [];
      // Convert string dates back to Date objects
      return parsedTasks.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        // Ensure status property exists for backward compatibility
        status: task.status || (task.completed ? 'completed' : 'todo'),
        // Add comments field if it doesn't exist
        comments: task.comments || ''
      }));
    } catch (e) {
      console.error('Error parsing saved tasks', e);
      return [];
    }
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Count tasks by status
  const taskCount = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const permission = await requestNotificationPermission();
      setNotificationsEnabled(permission);
      if (permission) {
        toast({
          description: "Task notifications enabled!",
          duration: 3000,
        });
      }
    };
    
    setupNotifications();
  }, [toast]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    // Simulate loading to show animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Schedule notifications for all tasks with due dates
  useEffect(() => {
    if (notificationsEnabled) {
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          scheduleNotification(
            { id: task.id, title: task.title },
            task.dueDate
          );
        }
      });
    }
  }, [tasks, notificationsEnabled]);

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
      dueDate: dueDate || null,
      comments: ''
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    // Schedule notification if due date is set
    if (dueDate && notificationsEnabled) {
      scheduleNotification({ id: newTask.id, title }, dueDate);
    }
    
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

  const updateTaskComments = (id: string, comments: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, comments }
          : task
      )
    );
    
    toast({
      description: "Comments updated",
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Cosmic background */}
      <div className="cosmic-bg" />
      
      {/* Only keep the main gradient element behind the card */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Only keep the nebula/gradient behind the card */}
        <div 
          className="nebula animate-nebula-pulse" 
          style={{
            width: '300px',
            height: '300px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a12] to-transparent"></div>
      </div>

      <div 
        className={`w-full ${isMobile ? 'max-w-md' : 'max-w-3xl'} transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} relative z-10`}
      >
        <header className="flex flex-col items-center mb-6 animate-slide-down">
          <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-[#00c8ff] to-[#3333ff] rounded-full text-white shadow-[0_0_15px_rgba(0,200,255,0.7)]">
            <ListTodo size={24} />
          </div>
          <h1 className="text-2xl font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">My Future</h1>
          <p className="text-[#b3e0ff] mt-1">Space-themed task management</p>
        </header>

        <div className="cosmic-container mb-4">
          <div className="p-4">
            <TaskInput onAddTask={addTask} />
          </div>
          
          <TaskList 
            tasks={tasks} 
            filter={filter}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
            onUpdateStatus={updateTaskStatus}
            onUpdateComments={updateTaskComments}
          />
          
          {tasks.length > 0 && (
            <div className="flex justify-center py-3 border-t border-white/10">
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
                className="text-sm text-gray-300 hover:text-[#00c8ff] flex items-center gap-1 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
