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

export async function exportData() {
  try {
    const data = await db.exercises.toArray();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    // download the file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exercises.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  }
}

export { db };
