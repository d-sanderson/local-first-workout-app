<script lang="ts">
	import { initialData, initialExercise } from '../data';
	import { db, type Exercise } from '../db.js';

	let formData = $state(structuredClone(initialExercise));

	let status: 'LOADING' | 'ERROR' | 'READY' = $state('LOADING');

	let loadedId: number | null | undefined = $state(null);

	let allExercises: null | Exercise[] = $state(null);

	async function generateDescription() {
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
						content: `Create a description for the following exercise ${formData.name} and muscle group ${formData.type}`
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
	}

	const save = async (data: typeof initialExercise) => {
		console.log('saving', data);
		if (loadedId) {
			await db.exercises.update(loadedId, {
				date: new Date().toISOString(),
				formData: data
			});
		} else {
			const newExerciseId = await db.exercises.add({
				date: new Date().toISOString(),
				formData: data
			});
			loadAllExercises();
			loadedId = newExerciseId;
		}
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

	$effect(() => {
		// seed data
		seedExerciseData();
		loadAllExercises();
		loadRecentExercise();
	});

	$effect(() => {
		if (status === 'READY') {
			save($state.snapshot(formData));
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

	function newExercise() {
		loadedId = null;
		formData = structuredClone(initialExercise);
	}

	async function deleteExercise(id: number) {
		await db.exercises.delete(id);
		loadAllExercises();
		loadRecentExercise();
	}

	async function exportData() {
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
</script>

<section class="grid h-screen place-items-center">
	<div class="w-full max-w-lg">
		<form class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="exercise">
				Select an exercise
			</label>
			<select onchange={loadExercise} value={loadedId}>
				{#if allExercises}
					{#each allExercises as exercise (exercise.id)}
						<option value={exercise.id}>{exercise.formData.name}</option>
					{/each}
				{/if}
			</select>
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
					<option value={formData.type} selected>{formData.type}</option>
					<option value="back">Back</option>
					<option value="legs">Legs</option>
					<option value="shoulders">Shoulders</option>
					<option value="arms">Arms</option>
					<option value="core">Core</option>
					<option value="cardio">Cardio</option>
				</select>
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
				<button class="bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none" onclick={generateDescription}>Generate Description</button>
			</div>
			<div class="flex items-center justify-between">
				<button
					class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="button"
					onclick={(e) => save(formData)}
				>
					Save
				</button>
				<button
					class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="button"
					onclick={newExercise}
				>
					New Exercise
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
				<button
					class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="button"
					onclick={exportData}
				>
					Export Data
				</button>
			</div>
		</form>
		<p class="text-center text-xs text-gray-500">
			&copy;2025 Improve yo self. All rights reserved.
		</p>
	</div>
</section>
