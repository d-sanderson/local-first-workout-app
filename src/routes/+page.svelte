<script>
	import ClerkLoaded from "clerk-sveltekit/client/ClerkLoaded.svelte";
import LoginPrompt from "../components/LoginPrompt.svelte";
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';

</script>

		<ClerkLoaded let:clerk>
			<LoginPrompt {clerk} />
		</ClerkLoaded>
