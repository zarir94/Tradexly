<script lang="ts">
	import { Button } from '$main/src/lib/components/ui/button/index.js';
	import { ChevronLeft, ChevronRight, HeadsetIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import NewTicketDialog from './newTicketDialog.svelte';
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

  export let data;
  export let form;

	let blockAnimation = $navigating == null;

  $: if (form?.msg) {
		(form?.success ? toast.success : toast.error)(form?.msg)
	}

	onMount(()=>{
		blockAnimation = false;
	})

	function getUpdatedUrl(paramName: string, paramValue: any) {
		let url = new URL($page.url.toString());
		url.searchParams.set(paramName, paramValue);
		return url.search;
	}
</script>
<svelte:head>
  <title>Support Center - {data.cached.site_name}</title>
</svelte:head>

<div class="p-3 md:p-4 lg:p-5 suppage">
  <div class="flex items-center justify-between mb-10">
		<div class="flex items-center gap-3">
			<div class="bg-zinc-100 text-zinc-800 p-2 rounded-lg">
				<HeadsetIcon/>
			</div>
			<div class="flex flex-col">
				<h1 class="font-bold text-2xl">Support Center</h1>
        <p class="text-zinc-300">Find assistance and track your support tickets</p>
			</div>
		</div>
    <NewTicketDialog/>
	</div>
	<div class="flex flex-col gap-5 mb-5">
		{#if data.tickets?.length == 0}
			<div class="flex flex-col items-center justify-center py-16 px-8 text-center">
				<div class="bg-muted/50 p-4 rounded-full mb-6">
					<HeadsetIcon class="size-8 text-muted-foreground"/>
				</div>
				<h3 class="text-xl font-semibold text-foreground mb-2">Nothing to See Here{data.page == 1 ? '... Yet!' : ''}</h3>
				<p class="text-muted-foreground max-w-md">
					There are no tickets to display right now. If you need assistance, simply click the "Create" button above and submit the form to open a new ticket.
				</p>
			</div>
		{/if}
		{#each data.tickets as t, i (t.id)}
			<div class="flex" in:fly|global={ blockAnimation ? { delay: 0, duration: 0, opacity: 1 } : { x: ((-1)**i) * 100 + '%', duration: 300, delay: i*100 }}>
				<Button class="w-full h-auto px-5 py-4 items-start justify-start flex-col whitespace-normal" variant="secondary" size="lg" href="/dashboard/support/ticket-{t.id}">
					<div class="flex gap-3 items-center">
						<h3 class="text-xl">{t.subject}</h3>
						<span class="leading-none px-2 py-1 rounded-md border
						{
						t.status == 'OPEN' ? 'text-blue-500 bg-blue-800/20 border-blue-800' :
						t.status == 'ANSWERED' ? 'text-emerald-500 bg-emerald-800/20 border-emerald-800' :
						t.status == 'REPLIED' ? 'text-amber-500 bg-amber-800/20 border-amber-800' :
						t.status == 'CLOSED' ? 'text-red-600 bg-red-800/20 border-red-800' :
						'text-purple-500 bg-purple-800/20 border-purple-800'
						}">{t.status}</span>
					</div>
					<p class="text-muted-foreground text-base line-clamp-2">{t.description.slice(0, -1).trim()}...</p>
					<div class="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
						<span>{t._count.messages} Messages</span>
						<span>Updated: {t.updatedAt.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '')}</span>
					</div>
				</Button>
			</div>
		{/each}
	</div>
	<div class="flex gap-3 mb-3">
		<Button size="icon" href="{getUpdatedUrl('page', data.page - 1)}" class="mr-auto {data.page > 1 ? '' : 'invisible'}"><ChevronLeft class="size-5"/></Button>
		{#if !( data.page == 1 && !data.hasNext )}
			<div class="flex-1 flex justify-center">
				<span class="px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md">Page {data.page}</span>
			</div>
		{/if}
		<Button size="icon" href="{getUpdatedUrl('page', data.page + 1)}" class="ml-auto {data.hasNext ? '' : 'invisible'}"><ChevronRight class="size-5"/></Button>
	</div>
</div>
