<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, CircleQuestionMarkIcon, FileQuestionMarkIcon, HandHelpingIcon, InfoIcon, MessageCircleQuestionMarkIcon, SearchIcon, ShieldQuestionMarkIcon, TriangleAlertIcon } from '@lucide/svelte';
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Button, buttonVariants } from '$main/src/lib/components/ui/button/index.js';
  import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { Skeleton } from '$main/src/lib/components/ui/skeleton/index.js';
	import { ScrollArea } from '$main/src/lib/components/ui/scroll-area/index.js';

  export let data;

	let blockAnimation = $navigating == null;
	let iconData: IconData[] = [];

	type IconData = {
		component: any;
		x: number;
		y: number;
		delay: number;
		color: string;
	};

	onMount(()=>{
		blockAnimation = false;
		const iconTypes = [MessageCircleQuestionMarkIcon, FileQuestionMarkIcon, HandHelpingIcon, InfoIcon, CircleQuestionMarkIcon, ShieldQuestionMarkIcon];
		const colors = ['text-amber-900', 'text-blue-900', 'text-green-900', 'text-purple-900', 'text-red-900', 'text-indigo-900'];
		const icons = Array.from({ length: 60 }, (_, i) => iconTypes[i % iconTypes.length]);
		iconData = icons.map((Icon, index) => {
			// Calculate grid position for even distribution
			const cols = 5;
			const rows = 5;
			const col = index % cols;
			const row = Math.floor(index / cols);
			const baseX = (col * 100) / cols;
			const baseY = (row * 100) / rows;
			// Add random offset for variation
			const offset = 10;
			const x = Math.max(5, Math.min(95, baseX + (Math.random() - 0.5) * offset * 2));
			const y = Math.max(5, Math.min(95, baseY + (Math.random() - 0.5) * offset * 2));
			return {
				component: Icon,
				x: x,
				y: y,
				delay: index * 0.3, // Stagger animation start
				color: colors[Math.floor(Math.random() * colors.length)]
			};
		});
	})

	function getUpdatedUrl(paramName: string, paramValue: any) {
		let url = new URL($page.url.toString());
		url.searchParams.set(paramName, paramValue);
		return url.search;
	}
</script>
<svelte:head>
  <title>Help Center - {data.cached.site_name}</title>
</svelte:head>

<div class="p-3 md:p-4 lg:p-5 helppage">
  <div class="flex items-center justify-between mb-10">
		<div class="flex items-center gap-3">
			<div class="bg-zinc-100 text-zinc-800 p-2 rounded-lg">
				<MessageCircleQuestionMarkIcon/>
			</div>
			<div class="flex flex-col">
				<h1 class="font-bold text-2xl">Help Center</h1>
        <p class="text-zinc-300">Find help, guides, and solutions to common issues here.</p>
			</div>
		</div>
	</div>
  <div class="relative h-60 sm:h-72 lg:h-96 { data.query ? '!h-auto py-10' : '' }">
    <div class="absolute w-full h-full inset-0 dcl overflow-hidden" class:hidden={data.query}>
      {#each iconData as icon}
        <div class="icon-wrapper odd:hidden sm:odd:block" style="left: {icon.x}%; top: {icon.y}%; animation-delay: {icon.delay}s;">
          <svelte:component this={icon.component} class={icon.color} />
        </div>
      {/each}
    </div>
    <div class="absolute w-full h-full inset-0 flex items-center justify-center">
      <div class="w-full h-full flex flex-col justify-center gap-10 items-center">
        <h2 class="text-2xl font-semibold tracking-wide" class:hidden={data.query}>How can we help you?</h2>
        <form method="get" class="w-full max-w-3xl">
					{#if data.page > 1}
						<input type="hidden" name="page" value={data.page}>
					{/if}
					{#if $page.url.searchParams.get('max')?.trim()}
						<input type="hidden" name="max" value={$page.url.searchParams.get('max')?.trim()}>
					{/if}
          <InputGroup.Root>
            <InputGroup.Input name="q" value={data.query} placeholder="Search help articles..." />
            <InputGroup.Addon align="inline-end">
              <InputGroup.Button type="submit" size="icon-sm"><SearchIcon/></InputGroup.Button>
            </InputGroup.Addon>
          </InputGroup.Root>
        </form>
      </div>
    </div>
  </div>
	<div class="max-w-3xl mx-auto">
		<div class="flex flex-col gap-5 mb-5">
			<h3 class="text-xl text-center my-5 font-bold tracking-wide">{data.query ? 'Here’s what we found' : 'You might be looking for'}</h3>
			{#each data.helps as h, i (h.id)}
				<div class="" in:fly|global={ blockAnimation ? { delay: 0, duration: 0, opacity: 1 } : { x: ((-1)**i) * 100 + '%', duration: 300, delay: i*100 }}>
					<Dialog.Root>
						<Dialog.Trigger class="{buttonVariants({ variant: 'secondary', size: 'lg' })} w-full justify-start !text-lg h-auto py-2">{h.question}</Dialog.Trigger>
						<Dialog.Content class="!max-w-6xl w-[95vw]">
							<Dialog.Header>
								<Dialog.Title class="sm:text-xl lg:text-2xl">{h.question}</Dialog.Title>
							</Dialog.Header>
							<ScrollArea class="w-full max-h-[calc(100vh-200px)]">
								<div class="prose prose-zinc prose-invert lg:prose-lg max-w-none">
									{#await fetch('/dashboard/api-getHelpArticle', { method: "POST", body: JSON.stringify({ id: h.id }) }).then(r=> r.ok ? r.json() : null )}
										<div class="space-y-2">
											<Skeleton class="w-[90%] h-4" />
											<Skeleton class="w-[75%] h-4" />
											<Skeleton class="w-[80%] h-4" />
											<Skeleton class="w-[97%] h-4" />
											<Skeleton class="w-[67%] h-4" />
											<Skeleton class="w-[78%] h-4" />
											<Skeleton class="w-[90%] h-4" />
											<Skeleton class="w-[60%] h-4" />
										</div>
									{:then d} 
										{#if d}
											{@html d.answer}
										{:else}
											<div class="py-5 flex flex-col gap-3 items-center justify-center text-center bg-red-900/20 border border-red-600/30 rounded-lg">
												<h3><TriangleAlertIcon class="inline mb-1"/> Something Went Wrong!</h3>
												<p>We cannot fetch article from server. Please refresh the page or try again later.</p>
											</div>
										{/if}
									{/await}
								</div>
							</ScrollArea>
							<Dialog.Footer>
								<Dialog.Close class="{buttonVariants({ variant: 'outline' })}">Close</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			{/each}
		</div>
		<div class="flex gap-3 mb-3" class:hidden={!data.query}>
			<Button size="icon" onclick={()=>{goto(getUpdatedUrl('page', data.page - 1))}} class="mr-auto {data.page > 1 ? '' : 'invisible'}"><ChevronLeft class="size-5"/></Button>
			{#if !( data.page == 1 && !data.hasNext )}
				<div class="flex-1 flex justify-center">
					<span class="px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md">Page {data.page}</span>
				</div>
			{/if}
			<Button size="icon" onclick={()=>{goto(getUpdatedUrl('page', data.page + 1))}} class="ml-auto {data.hasNext ? '' : 'invisible'}"><ChevronRight class="size-5"/></Button>
		</div>
	</div>
</div>
<style lang="postcss">
	@reference 'tailwindcss';
	.dcl :global(svg) { @apply size-20 opacity-20; }
	.dcl {
    -webkit-mask-image: 
        linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    mask-image: 
        linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-composite: intersect;
    mask-composite: intersect;
  }
	.dcl .icon-wrapper {
		position: absolute;
		animation: float 6s ease-in-out infinite;
	}
	@keyframes float {
		0%, 100% {
			transform: translateY(0px) rotate(0deg) scale(1);
		}
		50% {
			transform: translateY(-20px) rotate(5deg) scale(1.05);
		}
	}
</style>
