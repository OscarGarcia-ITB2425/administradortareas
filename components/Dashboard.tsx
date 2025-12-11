import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { PILLARS } from '../constants';
import { Task, PillarId } from '../types';
import Column from './Column';
import TaskModal from './TaskModal';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('pillar_tasks');
        return saved ? JSON.parse(saved) : [];
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    return [];
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Persist tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pillar_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  const addTask = (text: string, pillarId: string) => {
    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      pillarId: pillarId as PillarId,
      createdAt: Date.now(),
      priority: 3, // Default priority: Normal
      subtasks: []
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    // Also update the selected task state to reflect changes in the modal instantly
    setSelectedTask(updatedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-white/90 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform hover:scale-105">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pillar<span className="text-indigo-600">Focus</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span className="text-slate-400 font-normal">Usuario: </span>Oscar
              </span>
              <button
                onClick={onLogout}
                className="group flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                title="Cerrar sesión"
              >
                <span className="text-sm font-medium hidden sm:block group-hover:text-rose-600 transition-colors">Salir</span>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-[1920px] mx-auto h-full flex flex-col">
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full min-h-[calc(100vh-9rem)]">
            {PILLARS.map((pillar) => (
              <div key={pillar.id} className="h-full min-h-[500px] xl:min-h-0">
                <Column
                  pillar={pillar}
                  tasks={tasks.filter((t) => t.pillarId === pillar.id)}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onTaskClick={setSelectedTask}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Details Modal */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
