<script>
	import SignInButton from "clerk-sveltekit/client/SignInButton.svelte";
	import SignUpButton from "clerk-sveltekit/client/SignUpButton.svelte";
</script>

		<div class="flex h-screen items-center justify-center">
			<div
				class="mb-4 flex items-start rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
				role="alert"
			>
				<svg
					class="me-3 inline h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
					/>
				</svg>
				<span class="sr-only">Login</span>
				<div>
					<span class="font-medium">Login Required!</span>
					You have to
					<span>
						<SignInButton
							class="font-medium text-pink-600 hover:underline dark:text-pink-500"
							mode="modal"
						/>
					</span>
					to see this page.
					<div class="mt-4">
						<p>Don't have an account?</p>
						<SignUpButton
							class="font-medium text-pink-600 hover:underline dark:text-pink-500"
							mode="modal"
						/>
					</div>
				</div>
			</div>
		</div>
