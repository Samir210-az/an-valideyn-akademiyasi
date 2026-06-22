// Sistem üzrə əsas tip tərifləri

export type UserRole = "admin" | "specialist" | "parent";

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  diagnosis: string[];
  currentWeek: number; // 1-12
  assignedSpecialistId?: string;
  createdAt: string;
}

export interface Module {
  id: string;
  order: number; // 1-12
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  videoUrl?: string;
  articleContent?: string;
  imageUrl?: string;
  pdfUrl?: string;
  quizId?: string;
  order: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Assignment {
  id: string;
  lessonId: string;
  childId: string;
  parentVideoUrl?: string;
  parentImageUrl?: string;
  parentNote?: string;
  specialistFeedback?: string;
  score?: number;
  status: "pending" | "submitted" | "reviewed";
  submittedAt?: string;
  reviewedAt?: string;
}

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  nutrition: 1 | 2 | 3 | 4 | 5;
  aggressionLevel: 1 | 2 | 3 | 4 | 5;
  meltdownCount: number;
  communicationLevel: 1 | 2 | 3 | 4 | 5;
  taskCompletion: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ProgressGoal {
  id: string;
  childId: string;
  category: "speech" | "social" | "sensory" | "behavior" | "independence";
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "lesson" | "assignment" | "message" | "evaluation";
  read: boolean;
  createdAt: string;
}

export type PackageTier = "basic" | "standard" | "premium";

export interface Subscription {
  id: string;
  parentId: string;
  tier: PackageTier;
  status: "active" | "expired" | "cancelled";
  startedAt: string;
  expiresAt: string;
}

export interface Certificate {
  id: string;
  childId: string;
  parentId: string;
  certificateNumber: string;
  qrCodeUrl: string;
  issuedAt: string;
  pdfUrl: string;
}
