
import React, { useState } from 'react';
import { Check, Trash2, Clock, MessageSquare, AlarmClock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: Date | null;
  comments?: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onUpdateComments?: (id: string, comments: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDeleteTask,
  onUpdateStatus,
  onUpdateComments
}) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState(task.comments || '');
  
  const getStatusColor = (status: Task['status']) => {
    switch(status) {
      case 'todo': return 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/30';
      case 'in-progress': return 'bg-orange-900/60 text-orange-200 border border-orange-500/30';
      case 'completed': return 'bg-green-900/60 text-green-200 border border-green-500/30';
      default: return 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/30';
    }
  };

  const handleSaveComments = () => {
    if (onUpdateComments) {
      onUpdateComments(task.id, commentText);
    }
    setCommentsOpen(false);
  };

  const isTaskDueSoon = () => {
    if (!task.dueDate || task.completed) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    // Return true if due in less than 24 hours
    return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
  };

  return (
    <>
      <div 
        className={cn(
          "todo-item group flex items-center justify-between px-4 py-3 border-b border-white/10 animate-slide-up",
          task.completed && "completed"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
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
          <div className="flex flex-col min-w-0">
            <span className="todo-text transition-all duration-200 truncate font-medium text-white">{task.title}</span>
            {task.dueDate && (
              <span className={cn(
                "text-xs flex items-center gap-1 mt-1",
                isTaskDueSoon() ? "text-pink-300 neon-pulse" : "text-gray-400"
              )}>
                {isTaskDueSoon() ? <AlarmClock size={12} /> : <Clock size={12} />}
                {format(task.dueDate, "MMM d, yyyy h:mm a")}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommentsOpen(true)}
            className="text-indigo-300 hover:text-[#ff00cc] transition-colors"
            aria-label="Add comments"
          >
            <MessageSquare size={16} />
          </button>
          
          <select 
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value as Task['status'])}
            className={cn(
              "text-xs px-2 py-1 rounded-full border-0 focus:ring-0 cursor-pointer font-medium",
              getStatusColor(task.status)
            )}
            aria-label="Update task status"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <button
            onClick={() => onDeleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-destructive"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="sm:max-w-md bg-black/80 border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Comments for "{task.title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add notes, comments, or details about this task..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[150px] bg-black/50 border-white/20 text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentsOpen(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSaveComments}
              className="bg-gradient-to-r from-[#ff00cc] to-[#3333ff] text-white border-0">
              Save Comments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
