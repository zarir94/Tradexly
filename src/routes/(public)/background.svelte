<script lang="ts">
  import finisherJs from "$lib/js/finisher-header?url";
</script>
<svelte:head>
  <script src="{finisherJs}" defer></script>
</svelte:head>

<div class="bg finisher-header">

</div>
<style lang="postcss">
	@reference 'tailwindcss';
  .bg { @apply fixed w-screen h-screen z-[-1] top-0 left-0 bg-slate-950;}
  .bg::after {
    @apply fixed w-screen h-screen top-0 left-0 z-[-1] bg-transparent;
    content: "";
    background-image: radial-gradient(circle at top left, theme(--color-emerald-950), transparent 50%),
											radial-gradient(circle at bottom right, theme(--color-cyan-950), transparent 50%);
  }
</style>

