export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  rest_sec: number;
};

export type ProgramDay = {
  day: number;
  focus: string;
  duration_min: number;
  estimated_calories: number;
  equipment: string[];
  warmup: string;
  cooldown: string;
  exercises: Exercise[];
};

export type ProgramResponse = {
  days: ProgramDay[];
};
