// create db
import Dexie, { type EntityTable } from 'dexie';
import { initialExercise, initialWorkout } from './data';

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

const db = new Dexie('WorkoutsLocal') as Dexie & {
  workouts: EntityTable<Workout, 'id'>;
  exercises: EntityTable<Exercise, 'id'>;
};

db.version(1).stores({
  workouts: '++id, name, date, exercises',
  exercises: '++id, date, name, type, description',
});

export { db };
