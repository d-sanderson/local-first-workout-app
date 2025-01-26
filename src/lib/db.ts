// create db
import Dexie, { type EntityTable } from 'dexie';
import type { Exercise, Workout } from './types';

const db = new Dexie('WorkoutsLocal') as Dexie & {
  workouts: EntityTable<Workout, 'id'>;
  exercises: EntityTable<Exercise, 'id'>;
};

db.version(1).stores({
  workouts: '++id, name, date, exercises',
  exercises: '++id, date, name, type, description',
});

export { db };
