<script lang="ts">
  import "./app.css";
  import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from "./app-sidebar.svelte";
  export let children;
</script>

<Sidebar.Provider>
  <AppSidebar/>
  <main>
    <Sidebar.Trigger/>
    {@render children?.()}
  </main>
</Sidebar.Provider>
