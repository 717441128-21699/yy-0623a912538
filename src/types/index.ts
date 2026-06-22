export interface TaskItem {
  id: string;
  customerName: string;
  treatmentArea: string;
  estimatedTime: number;
  consentSigned: boolean;
  photoRequired: boolean;
  photoTaken: boolean;
  equipment: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overtime';
  startTime: string;
  endTime: string;
  energyLevel: string;
  nextColleague: string;
}

export interface PrepStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'equipment' | 'room' | 'material' | 'disinfection';
}

export interface HandoverItem {
  id: string;
  taskRef: string;
  customerName: string;
  steps: HandoverStep[];
  isCompleted: boolean;
  delayMinutes: number;
  delayReason: string;
  delayScript: string;
}

export interface HandoverStep {
  id: string;
  title: string;
  completed: boolean;
  type: 'clean' | 'cool' | 'energy' | 'handover';
}

export interface SwapRequest {
  id: string;
  requesterName: string;
  requesterAvatar: string;
  shiftDate: string;
  shiftTime: string;
  equipment: string;
  reason: string;
  status: 'open' | 'taken' | 'expired';
  takerName?: string;
  createdAt: string;
  points: number;
}

export interface RankItem {
  id: string;
  name: string;
  avatar: string;
  points: number;
  completedTasks: number;
  perfectHandovers: number;
  rank: number;
}

export interface FeedbackItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  category: 'praise' | 'suggestion' | 'issue';
  createdAt: string;
  likes: number;
}

export interface LearningReminder {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz';
  deadline: string;
  completed: boolean;
  points: number;
}
