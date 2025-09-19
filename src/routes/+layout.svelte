<script lang="ts">
	import PI from "$lib/assets/preview_image.png";
	import { ProgressBar } from "@prgm/sveltekit-progress-bar";
	export let children;
	export let data;
</script>

<svelte:head>
	<!-- Open Graph Meta Tags for Social Media Sharing -->
	<meta property="og:title" content="{data.cached.site_name} - {data.cached.site_slogan}">
	<meta property="og:description" content="TradeXcope is a binary trading platform where you can gain enough trusting your instinct. Beginner or Pro - whoever you are, every trade counts here. In short, its your gateway to gains.">
	<meta property="og:image" content="{PI}">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="{data.cached.site_name}">

	<!-- Twitter Card Meta Tags (for Twitter-specific previews) -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="{data.cached.site_name} - {data.cached.site_slogan}">
	<meta name="twitter:description" content="TradeXcope is a binary trading platform where you can gain enough trusting your instinct. Beginner or Pro - whoever you are, every trade counts here. In short, its your gateway to gains.">
	<meta name="twitter:image" content="{PI}">
</svelte:head>

<ProgressBar class="text-emerald-600" zIndex={999999} maximum={0.965}/>
{@render children?.()}
