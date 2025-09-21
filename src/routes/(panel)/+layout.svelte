<script lang="ts">
  import "./app.css";
  import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from "./app-sidebar.svelte";
	import AppHeader from "./app-header.svelte";
  export let children;
</script>

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
