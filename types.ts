import React from 'react';

export type PillarId = 'estudios' | 'negocio' | 'inversion' | 'social';
export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export interface Subtask {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: PriorityLevel;
}

export interface Task {
  id: string;
  text: string;
  pillarId: PillarId;
  createdAt: number;
  dueDate?: number; // timestamp
  priority: PriorityLevel;
  subtasks: Subtask[];
}

export interface PillarConfig {
  id: PillarId;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}