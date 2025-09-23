<script lang="ts">
	//@ts-nochecks
	import { Trigger } from "$lib/components/ui/sidebar/index";
	import { Separator } from "$main/src/lib/components/ui/separator/index";
	import HeaderNotification from "./headerNotification.svelte";
	import HeaderUserInfo from "./headerUserInfo.svelte";
</script>

<header class="bg-card w-full h-14 border-b p-2 md:px-3 flex items-center">
	<Trigger class="sbtrigger mr-auto"/>
	<HeaderNotification/>
	<div class="mx-1"></div>
	<HeaderUserInfo/>
</header>

<style lang="postcss">
  @reference 'tailwindcss';
	header :global(.sbtrigger) { @apply size-10; }
	header :global(.sbtrigger svg) { @apply size-6; }
</style>