import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TaskInputProps {
  onAddTask: (title: string, dueDate?: Date | null) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle, dueDate);
      setTaskTitle('');
      setDueDate(null);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative group animate-fade-in"
    >
      <div className="flex">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-3 pr-24 text-todo-text placeholder-gray-400/70 bg-white border border-todo-divider/50 rounded-xl shadow-sm transition-all duration-200 focus:border-todo-accent custom-focus"
          aria-label="Add a new task"
        />
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 text-gray-400 hover:text-todo-accent"
                aria-label="Set due date"
              >
                <Calendar size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="end">
              <div className="p-3">
                <div className="space-y-3">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate || undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Keep the time if it was already set
                        const newDate = new Date(date);
                        if (dueDate) {
                          newDate.setHours(dueDate.getHours(), dueDate.getMinutes());
                        } else {
                          // Default to end of day
                          newDate.setHours(23, 59);
                        }
                        setDueDate(newDate);
                      } else {
                        setDueDate(null);
                      }
                    }}
                    className="rounded-md pointer-events-auto"
                  />
                  {dueDate && (
                    <>
                      <div className="flex justify-between items-center">
                        <label htmlFor="time" className="text-sm font-medium">Time:</label>
                        <input
                          id="time"
                          type="time"
                          value={dueDate ? format(dueDate, "HH:mm") : ""}
                          onChange={(e) => {
                            if (dueDate && e.target.value) {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date(dueDate);
                              newDate.setHours(hours, minutes);
                              setDueDate(newDate);
                            }
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDueDate(null)}
                        >
                          Clear
                        </Button>
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <button
          type="submit"
          disabled={!taskTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 bg-todo-accent text-white opacity-90 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Add task"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
      {dueDate && (
        <div className="mt-2 text-xs flex items-center gap-1 text-todo-accent">
          <Calendar size={12} />
          <span>Due: {format(dueDate, "MMM d, yyyy 'at' h:mm a")}</span>
        </div>
      )}
    </form>
  );
};

export default TaskInput;
