<script lang="ts">
	import ExerciseForm from '../../components/ExerciseForm.svelte';
	import ClerkLoaded from 'clerk-sveltekit/client/ClerkLoaded.svelte';
	import LoginPrompt from '../../components/LoginPrompt.svelte';
</script>

<ClerkLoaded let:clerk>
	{#if !clerk?.user}
		<LoginPrompt {clerk} />
	{:else}
		<ExerciseForm {clerk} />
	{/if}
</ClerkLoaded>
