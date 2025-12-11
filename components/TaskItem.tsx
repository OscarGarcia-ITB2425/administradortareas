import React from 'react';
import { X, Calendar, CheckSquare, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  color: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onClick, color }) => {
  // Helpers
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  
  const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

  const isOverdue = task.dueDate ? Date.now() > task.dueDate : false;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'blue': return 'hover:border-blue-300 hover:bg-blue-50/50';
      case 'emerald': return 'hover:border-emerald-300 hover:bg-emerald-50/50';
      case 'violet': return 'hover:border-violet-300 hover:bg-violet-50/50';
      case 'rose': return 'hover:border-rose-300 hover:bg-rose-50/50';
      default: return 'hover:border-slate-300 hover:bg-slate-50/50';
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(task)}
      className={`group relative flex flex-col p-3 mb-2 bg-white rounded-xl border border-slate-100 shadow-sm transition-all duration-200 cursor-pointer ${getColorClasses(color)}`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
             <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${priorityConfig.bg} ${priorityConfig.color}`}>
                <Flag size={10} fill="currentColor" />
                {task.priority}
             </div>
             {task.dueDate && (
               <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                 <Calendar size={10} />
                 {formatDate(task.dueDate)}
               </div>
             )}
          </div>
          <span className="text-slate-700 text-sm font-medium leading-relaxed break-words block">
            {task.text}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 opacity-0 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>

      {totalSubtasks > 0 && (
        <div className="mt-3 w-full">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <CheckSquare size={12} />
            <span>{completedSubtasks}/{totalSubtasks} pasos</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${completedSubtasks === totalSubtasks ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.li>
  );
};

export default TaskItem;
