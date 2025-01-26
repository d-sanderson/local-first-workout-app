<script lang="ts">
	import '../app.css';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import SignInButton from 'clerk-sveltekit/client/SignInButton.svelte';
	import SignUpButton from 'clerk-sveltekit/client/SignUpButton.svelte';
	let { children } = $props();
</script>

<div class="flex justify-end gap-4 p-2">
	<SignedIn>
		<UserButton afterSignOutUrl="/" showName={true} />
	</SignedIn>
	<SignedOut>
		<SignInButton
			class="font-medium text-blue-600 hover:underline dark:text-blue-500"
			mode="modal"
			
		/>
		<SignUpButton
			class="font-medium text-blue-600 hover:underline dark:text-blue-500"
			mode="modal"
		/>
		<!-- You could also use <SignInButton mode="modal" /> and <SignUpButton mode="modal" /> here -->
	</SignedOut>
</div>

{@render children()}
