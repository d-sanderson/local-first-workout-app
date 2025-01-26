import type { initialExercise, initialWorkout } from "./data";

export interface Workout {
  id?: number;
  date: string;
  formData: typeof initialWorkout;
}

export interface IExercise extends Exercise {
  sets: number;
  reps: number;
  type: string;
  weight: number;
}

export interface Exercise {
  date: string;
  id?: number;
  formData: typeof initialExercise;
}

export type LoadingState =  'LOADING' | 'ERROR' | 'READY'
