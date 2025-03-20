
import React, { useState } from 'react';
import { Check, Trash2, Clock, MessageSquare } from 'lucide-react';
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
      case 'todo': return 'bg-gray-200 text-gray-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleSaveComments = () => {
    if (onUpdateComments) {
      onUpdateComments(task.id, commentText);
    }
    setCommentsOpen(false);
  };

  return (
    <>
      <div 
        className={cn(
          "todo-item group flex items-center justify-between px-4 py-3 border-b border-todo-divider/50 animate-slide-up",
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
            <span className="todo-text transition-all duration-200 truncate font-medium">{task.title}</span>
            {task.dueDate && (
              <span className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <Clock size={12} />
                {format(task.dueDate, "MMM d, yyyy h:mm a")}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommentsOpen(true)}
            className="text-gray-500 hover:text-[#a02727] transition-colors"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comments for "{task.title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add notes, comments, or details about this task..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveComments}>
              Save Comments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
