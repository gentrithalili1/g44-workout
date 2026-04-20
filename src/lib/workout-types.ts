export type Exercise = {
	id: string;
	name: string;
	sets: string;
	rest: string;
};

export type WorkoutDay = {
	id: string;
	title: string;
	exercises: Exercise[];
};

export type Workout = {
	id: string;
	name: string;
	days: WorkoutDay[];
};

export type WorkoutsFile = Workout[];
