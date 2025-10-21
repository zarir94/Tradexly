<script>
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

  export let data;
  export let form;
  
  let blockAnimation = $navigating == null;

  $: if (form?.msg) {
		(form?.success ? toast.success : toast.error)(form?.msg)
	}

  onMount(()=>{
		blockAnimation = false;
	})
</script>
<svelte:head>
  <title>Tutorials - {data.cached.site_name}</title>
</svelte:head>

<div class="p-3 md:p-4 lg:p-5 tutpage">
	<h2 class="text-2xl">Trading Tutorials</h2>
</div>