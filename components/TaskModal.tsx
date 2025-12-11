import React, { useState } from 'react';
import { X, Calendar, Flag, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Subtask, PriorityLevel } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [editedText, setEditedText] = useState(task.text);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newSubtaskPriority, setNewSubtaskPriority] = useState<PriorityLevel>(3);

  if (!isOpen) return null;

  // Handlers for Task Properties
  const handlePriorityChange = (level: PriorityLevel) => {
    onUpdate({ ...task, priority: level });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value).getTime() : undefined;
    onUpdate({ ...task, dueDate: date });
  };

  const handleTextBlur = () => {
    if (editedText.trim() !== task.text) {
      onUpdate({ ...task, text: editedText });
    }
  };

  // Handlers for Subtasks
  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;

    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      text: newSubtaskText,
      isCompleted: false,
      priority: newSubtaskPriority
    };

    onUpdate({
      ...task,
      subtasks: [...task.subtasks, newSubtask]
    });
    setNewSubtaskText('');
    setNewSubtaskPriority(3);
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  // Helpers
  const dateValue = task.dueDate 
    ? new Date(task.dueDate).toISOString().split('T')[0] 
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-start">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleTextBlur}
            rows={1}
            className="text-xl font-bold text-slate-800 bg-transparent resize-none focus:outline-none w-full mr-4"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Controls: Priority & Date */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Prioridad</label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as PriorityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handlePriorityChange(level)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      task.priority === level 
                        ? `${PRIORITY_CONFIG[level].bg} ${PRIORITY_CONFIG[level].color} ring-2 ring-offset-2 ring-indigo-500` 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">{PRIORITY_CONFIG[task.priority].label}</p>
            </div>

            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Fecha Límite</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="date"
                  value={dateValue}
                  onChange={handleDateChange}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mini Tareas</label>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <AnimatePresence>
                {task.subtasks.map((subtask) => (
                  <motion.div 
                    key={subtask.id}
                    layout
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group"
                  >
                    <button onClick={() => toggleSubtask(subtask.id)} className="text-slate-400 hover:text-indigo-600">
                      {subtask.isCompleted ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${subtask.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {subtask.text}
                      </p>
                    </div>

                    {/* Subtask Priority Badge */}
                    <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${PRIORITY_CONFIG[subtask.priority].bg} ${PRIORITY_CONFIG[subtask.priority].color}`}>
                      P{subtask.priority}
                    </div>

                    <button 
                      onClick={() => deleteSubtask(subtask.id)}
                      className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={addSubtask} className="flex gap-2 items-center mt-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Añadir paso..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {/* Mini Priority Selector for Subtask */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                {([1, 5] as PriorityLevel[]).map(p => (
                   <button
                    key={p}
                    type="button"
                    onClick={() => setNewSubtaskPriority(p)}
                    title={p === 5 ? "Alta Prioridad" : "Baja Prioridad"}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                      newSubtaskPriority === p ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                   >
                     {p}
                   </button>
                ))}
                 {/* Simple toggle between 1 and 5 for quick add, or we could do a dropdown. Let's do a simple cycle or just show current. 
                     Actually, let's just show a small numeric input or a select for space. 
                 */}
              </div>
              <select 
                 value={newSubtaskPriority}
                 onChange={(e) => setNewSubtaskPriority(Number(e.target.value) as PriorityLevel)}
                 className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 py-2.5 outline-none"
              >
                <option value="1">P1</option>
                <option value="2">P2</option>
                <option value="3">P3</option>
                <option value="4">P4</option>
                <option value="5">P5</option>
              </select>

              <button 
                type="submit"
                disabled={!newSubtaskText.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
          <button 
             onClick={() => { onDelete(task.id); onClose(); }}
             className="text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Eliminar Tarea
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Listo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;
