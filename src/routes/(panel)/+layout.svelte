<script lang="ts">
  import "./app.css";
  import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from "./app-sidebar.svelte";
	import AppHeader from "./app-header.svelte";
  import { Toaster } from "$lib/components/ui/sonner/index";
  export let children;
</script>

<Toaster richColors position="top-center" closeButton/>

<Sidebar.Provider>
  <AppSidebar/>
  <main class="w-full">
    <AppHeader/>
    {@render children?.()}
  </main>
</Sidebar.Provider>

<style lang="postcss">
  @reference 'tailwindcss';
</style>
