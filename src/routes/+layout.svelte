<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>
<a  href="/workouts" id="workout">Workouts</a>
<a href="/exercises" id="exercises">Exercises</a>

{@render children()}
