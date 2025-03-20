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

  // Render space particles with improved glow
  const renderSpaceParticles = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div 
        key={`particle-${i}`}
        className="space-dust"
        style={{
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${15 + Math.random() * 15}s`,
          boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(0, 200, 255, 0.8)`,
        }}
      />
    ));
  };

  // Render floating stars with improved variety and glow
  const renderFloatingStars = () => {
    return Array.from({ length: 40 }).map((_, i) => (
      <div 
        key={`star-${i}`}
        className={`absolute ${Math.random() > 0.7 ? 'twinkle' : 'animate-star-shine'} text-white opacity-70`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 7}s`,
          transform: `rotate(${Math.random() * 360}deg) scale(${0.7 + Math.random() * 0.6})`,
          filter: `drop-shadow(0 0 ${Math.random() * 5 + 2}px rgba(0, 200, 255, 0.7))`,
        }}
      >
        {Math.random() > 0.6 ? <Star size={Math.random() * 8 + 2} className="fill-white" /> : Math.random() > 0.5 ? '✦' : '✧'}
      </div>
    ));
  };

  // Render cosmic elements (planets, nebulae) with enhanced glow
  const renderCosmicElements = () => {
    return (
      <>
        <div 
          className="planet animate-cosmic-glow animate-floating-slow" 
          style={{
            width: '100px',
            height: '100px',
            right: '5%',
            top: '20%',
            opacity: 0.7,
            filter: 'drop-shadow(0 0 20px rgba(0, 200, 255, 0.5))',
          }}
        />
        
        <div 
          className="nebula animate-nebula-pulse" 
          style={{
            width: '300px',
            height: '300px',
            left: '10%',
            bottom: '10%',
            filter: 'blur(30px) drop-shadow(0 0 30px rgba(199, 112, 240, 0.6))',
          }}
        />
        
        <div 
          className="galaxy animate-galaxy-spin animate-cosmic-glow" 
          style={{
            width: '200px',
            height: '200px',
            right: '15%',
            bottom: '15%',
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))',
          }}
        />

        {/* Add a glowing diamond-like crystal */}
        <div
          className="absolute animate-cosmic-glow"
          style={{
            width: '120px',
            height: '120px',
            left: '25%',
            top: '30%',
            background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.2), rgba(51, 51, 255, 0.2))',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            transform: 'rotate(15deg)',
            boxShadow: '0 0 30px rgba(0, 200, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Add a hexagonal element */}
        <div
          className="absolute animate-floating-slow animate-cosmic-glow"
          style={{
            width: '90px',
            height: '90px',
            right: '35%',
            top: '60%',
            background: 'linear-gradient(45deg, rgba(51, 51, 255, 0.2), rgba(0, 200, 255, 0.2))',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            boxShadow: '0 0 30px rgba(51, 51, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animationDelay: '2s',
          }}
        />

        {/* Add a ring element */}
        <div
          className="absolute animate-galaxy-spin"
          style={{
            width: '150px',
            height: '150px',
            left: '65%',
            top: '10%',
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: 'rgba(0, 200, 255, 0.4)',
            borderBottomColor: 'rgba(51, 51, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 200, 255, 0.5)',
            transform: 'rotate(45deg)',
            filter: 'blur(1px)',
          }}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Cosmic background */}
      <div className="cosmic-bg" />
      
      {/* Space theme background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {renderSpaceParticles()}
        {renderFloatingStars()}
        {renderCosmicElements()}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a12] to-transparent"></div>
      </div>

      {/* Animated elements */}
      <div className="absolute right-[10%] top-[15%] animate-floating drop-shadow-[0_0_15px_rgba(142,255,142,0.7)]">
        <Rocket size={32} className="text-[#8eff8e] transform rotate-45" />
      </div>
      
      <div className="absolute left-[15%] top-[25%] animate-floating drop-shadow-[0_0_15px_rgba(142,255,142,0.7)]" style={{ animationDelay: '2s' }}>
        <Sparkles size={24} className="text-[#8eff8e] opacity-70" />
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
