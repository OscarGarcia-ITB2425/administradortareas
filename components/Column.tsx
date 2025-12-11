import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Task, PillarConfig } from '../types';
import TaskItem from './TaskItem';

interface ColumnProps {
  pillar: PillarConfig;
  tasks: Task[];
  onAddTask: (text: string, pillarId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ pillar, tasks, onAddTask, onDeleteTask, onTaskClick }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), pillar.id);
      setNewTaskText('');
    }
  };

  // Helper for dynamic dynamic header colors
  const getHeaderColor = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-100',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      violet: 'bg-violet-50 text-violet-700 border-violet-100',
      rose: 'bg-rose-50 text-rose-700 border-rose-100',
    };
    return map[color] || 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const getButtonColor = (color: string) => {
    const map: Record<string, string> = {
      blue: 'text-blue-600 hover:bg-blue-100',
      emerald: 'text-emerald-600 hover:bg-emerald-100',
      violet: 'text-violet-600 hover:bg-violet-100',
      rose: 'text-rose-600 hover:bg-rose-100',
    };
    return map[color] || 'text-slate-600 hover:bg-slate-100';
  };

  const Icon = pillar.icon;

  // Sort tasks by priority (desc) then by date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.createdAt - b.createdAt;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b flex items-center gap-3 ${getHeaderColor(pillar.color)}`}>
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg tracking-tight">{pillar.title}</h3>
          <p className="text-xs opacity-80 font-medium">{tasks.length} Tareas</p>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <ul className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sortedTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onDelete={onDeleteTask} 
                onClick={onTaskClick}
                color={pillar.color} 
              />
            ))}
          </AnimatePresence>
        </ul>
        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg m-2">
            <span className="opacity-50">Sin tareas activas</span>
          </div>
        )}
      </div>

      {/* Add Task Input */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Añadir tarea..."
            className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className={`absolute right-1 top-1 bottom-1 px-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-30 ${getButtonColor(pillar.color)}`}
          >
            <Plus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Column;
