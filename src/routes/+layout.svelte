<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import LoadingBar from '$lib/components/LoadingBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<LoadingBar />

<div class="flex h-screen flex-col bg-slate-950">
	<!-- Header at the top -->
	<Header />

	<!-- Sidebar and content below the header -->
	<div class="flex flex-1 overflow-hidden">
		<Sidebar />
		<main class="flex-1 overflow-auto bg-slate-950 p-6 text-slate-100">
			{@render children()}
		</main>
	</div>
</div>
