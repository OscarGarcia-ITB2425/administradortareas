import { PillarConfig, PriorityLevel } from './types';
import { BookOpen, Briefcase, TrendingUp, Users } from 'lucide-react';

export const PILLARS: PillarConfig[] = [
  { 
    id: 'estudios', 
    title: 'Estudios', 
    color: 'blue',
    icon: BookOpen
  },
  { 
    id: 'negocio', 
    title: 'Negocio', 
    color: 'emerald',
    icon: Briefcase
  },
  { 
    id: 'inversion', 
    title: 'Inversión', 
    color: 'violet',
    icon: TrendingUp
  },
  { 
    id: 'social', 
    title: 'Social', 
    color: 'rose',
    icon: Users
  },
];

export const PRIORITY_CONFIG: Record<PriorityLevel, { color: string; label: string; bg: string }> = {
  1: { color: 'text-slate-500', bg: 'bg-slate-100', label: 'Baja' },
  2: { color: 'text-blue-500', bg: 'bg-blue-100', label: 'Normal' },
  3: { color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Media' },
  4: { color: 'text-orange-500', bg: 'bg-orange-100', label: 'Alta' },
  5: { color: 'text-rose-600', bg: 'bg-rose-100', label: 'Crítica' },
};
