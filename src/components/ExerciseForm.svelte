<script lang="ts">
	import { initialData, initialExercise } from '$lib/data';
	import { db, exportData } from '$lib/db';
	import type { Exercise, LoadingState } from '$lib/types';

  // State
	const muscleGroups = ['Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Chest'];

	let formData = $state(structuredClone(initialExercise));

	let status: LoadingState = $state('LOADING');

	let loadedId: number | null | undefined = $state(null);

	let allExercises: null | Exercise[] = $state(null);

  // AI
	const generateDescription = async () => {
		status = 'LOADING';
		const response = await fetch('/api/completion', {
			method: 'POST',
			body: JSON.stringify({
				messages: [
					{
						role: 'system',
						content:
							'You are an exercise expert who can generate concise and accurate exercise descriptions. Do not include formatting like markdown or HTML.'
					},
					{
						role: 'user',
						content: `Create a description for the following exercise ${formData.name}`
					}
				]
			})
		});
		// set loading to true while we wait for the response
		try {
			const data = await response.json();
			console.log('content', data);
			formData.description = data.response.result.response;
			status = 'READY';
		} catch (e) {
			console.error(e);
			status = 'ERROR';
		}
	};

	const generateMuscleGroup = async () => {
		status = 'LOADING';
		console.log(formData.name);
		const response = await fetch('/api/completion', {
			method: 'POST',
			body: JSON.stringify({
				messages: [
					{
						role: 'system',
						content:
							'You are an exercise expert who can generate concise and accurate muscle group descriptions. Do not include formatting like markdown or HTML.'
					},
					{
						role: 'user',
						content: `Create a muscle group for the following exercise ${formData.name}. The options are ${muscleGroups.join(
							', '
						)}`
					}
				]
			})
		});
		try {
			const data = await response.json();
			console.log('content', data);
			formData.type = data.response.result.response;
			status = 'READY';
		} catch (e) {
			console.error(e);
			status = 'ERROR';
		}
	};

  // CRUD
	const saveExercise = async (data: typeof initialExercise) => {
		if (loadedId) {
			await db.exercises.update(loadedId, {
				date: new Date().toISOString(),
				formData: data
			});
		} else {
			if (!data.name) {
				return;
			}
			if (!data.type) {
				return;
			}
			if (!data.description) {
				return;
			}
			const newExerciseId = await db.exercises.add({
				date: new Date().toISOString(),
				formData: data
			});
			loadedId = newExerciseId;
		}
		loadAllExercises();
	};

	const createExercise = () => {
		loadedId = null;
		formData = structuredClone(initialExercise);
	};

	const deleteExercise = async (id: number) => {
		await db.exercises.delete(id);
		loadAllExercises();
		loadRecentExercise();
	};

	const loadExercise = async (event: Event) => {
		status = 'LOADING';
		const select = event.target as HTMLSelectElement;
		const id = select.value ? parseFloat(select.value) : null;
		if (id) {
			const exercise = await db.exercises.get(id);
			if (exercise) {
				formData = exercise.formData;
				loadedId = id;
			}
		}
		status = 'READY';
	};

	const loadAllExercises = async () => {
		allExercises = await db.exercises.orderBy('date').toArray();
	};

	const seedExerciseData = async () => {
		const data = await db.exercises.toArray();
		console.log(data);
		if (data.length === 0) {
			await db.exercises.bulkAdd(initialData.exercises);
			loadAllExercises();
		}
	};

  // on mount seed data, load exercise, and display the most recent exercise
	$effect(() => {
		// seed data
		seedExerciseData();
		loadAllExercises();
		loadRecentExercise();
	});


	$effect(() => {
		if (status === 'READY') {
			saveExercise($state.snapshot(formData));
		}
	});

	async function loadRecentExercise() {
		status = 'LOADING';
		const mostRecentExercise = await db.exercises.orderBy('date').last();
		if (mostRecentExercise) {
			formData = mostRecentExercise.formData;
			loadedId = mostRecentExercise.id;
		}
		status = 'READY';
	}
</script>

<section class="grid h-screen place-items-center">
	<div class="w-full max-w-lg">
		<div class="flex justify-end">
			<button
				class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				type="button"
				onclick={exportData}
			>
				Export Data
			</button>
		</div>
		<form class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
			<div class="mb-6 grid grid-flow-col">
				<div>
					<label class="mb-2 block text-sm font-bold text-gray-700" for="exercise">
						Select an exercise
					</label>
					<select onchange={loadExercise} value={loadedId}>
						{#if allExercises}
							{#each allExercises as exercise}
								<option value={exercise.id}>{exercise.formData.name}</option>
							{/each}
						{/if}
					</select>
				</div>
				<button
					class="focus:shadow-outline h-fit place-self-end rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="button"
					onclick={createExercise}
				>
					New Exercise
				</button>
			</div>
			<div class="mb-6">
				<label class="mb-2 block text-sm font-bold text-gray-700" for="name"> Execise Name </label>
				<input
					class="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
					id="name"
					type="text"
					bind:value={formData.name}
				/>
			</div>
			<div class="mb-6">
				<label class="mb-2 block text-sm font-bold text-gray-700" for="type"> Muscle Group </label>
				<select
					class="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
					id="type"
					bind:value={formData.type}
				>
					{#each muscleGroups as type}
						<option value={type} selected={formData.type === type}>{type}</option>
					{/each}
				</select>
				<button
					onclick={generateMuscleGroup}
					class="bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				>
					Generate Muscle Group
				</button>
			</div>
			<div class="mb-6">
				<label class="mb-2 block text-sm font-bold text-gray-700" for="description">
					Description
				</label>
				{#if status === 'LOADING'}
					<p>Loading...</p>
				{/if}
				{#if status === 'ERROR'}
					<p>Error loading description</p>
				{/if}
				{#if status === 'READY'}
					<textarea
						class="focus:shadow-outline mb-3 h-32 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						id="description"
						bind:value={formData.description}
					></textarea>
				{/if}
				<button
					class="bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					onclick={generateDescription}>Generate Description</button
				>
			</div>
			<div class="flex items-center justify-end gap-2">
				<button
					class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="button"
					onclick={(e) => saveExercise(formData)}
				>
					Save
				</button>
				{#if loadedId}
					<button
						class="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
						type="button"
						onclick={() => loadedId && deleteExercise(loadedId)}
					>
						Delete
					</button>
				{/if}
			</div>
		</form>
		<p class="text-center text-xs text-gray-500">
			&copy;2025 Improve yo self. All rights reserved.
		</p>
	</div>
</section>
