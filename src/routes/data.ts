
export const initialExercise = {
  name: '',
  type: '',
  description: '',
}

export const initialWorkout = {
  name: '',
  exercises: [],
}

export const initialData = {
  workouts: [
  ],
  exercises: [
    {
      date: '2020-01-01',
      formData: {
        name: 'Bench Press',
        type: 'Chest',
        description: '3 sets of 10 reps',
      }
    },
    {
      date: '2020-01-01',
      formData: {
        name: 'Squats',
        type: 'Legs',
        description: '3 sets of 10 reps',
      }
    },
    {
      date: '2020-01-01',
      formData: {
        name: 'Deadlifts',
        type: 'Back',
        description: '3 sets of 10 reps',
      }
    }
  ],
}
