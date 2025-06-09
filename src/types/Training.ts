import { Department } from "./Department";

export interface Training {
  id: number;
  title: string;
  description: string;
  provider: string;
  departments: Department[];
  duration: number; // in hours
  maxParticipants: number;
  sessionsCount: number;
  status: 'active' | 'inactive';
}