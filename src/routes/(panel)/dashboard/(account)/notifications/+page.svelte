<script lang="ts">
	import { Button, buttonVariants } from '$main/src/lib/components/ui/button/index.js';
	import { BellIcon, CheckCheckIcon, ChevronLeft, ChevronRight, Clock, Trash2Icon, Undo2Icon } from '@lucide/svelte';
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { fly } from 'svelte/transition';
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { enhanceWithLoader } from '$main/src/lib/publicFunc.js';
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
	<title>Notifications - {data.cached.site_name}</title>
</svelte:head>

<div class="p-3 md:p-4 lg:p-5 notipage">
	<div class="flex items-center justify-between mb-10">
		<div class="flex items-center gap-3">
			<div class="bg-zinc-100 text-zinc-800 p-2 rounded-lg">
				<BellIcon/>
			</div>
			<div class="flex flex-col">
				<h1 class="font-bold text-2xl">Notifications</h1>
				<p class="text-zinc-300">{data.unseenNotificationCount ? `You have ${data.unseenNotificationCount} unread notifications` : 'All caught up! No new notifications'}</p>
			</div>
		</div>
		{#if data.unseenNotificationCount}
			<form method="post" use:enhanceWithLoader>
				<Button variant="secondary" type="submit" name="action" value="allread">
					<CheckCheckIcon/>
					<span class="sm:hidden">All Read</span>
					<span class="hidden sm:inline">Mark all as read</span>
				</Button>
			</form>
		{/if}
	</div>
	<div class="flex flex-col gap-5 mb-5">
		{#if data.notifications?.length == 0}
			<div class="flex flex-col items-center justify-center py-16 px-8 text-center">
				<div class="bg-muted/50 p-4 rounded-full mb-6">
					<BellIcon class="size-8 text-muted-foreground"/>
				</div>
				<h3 class="text-xl font-semibold text-foreground mb-2">No notifications {data.page == 1 ? 'yet' : 'on this page'}</h3>
				<p class="text-muted-foreground max-w-md">
					You're all caught up! We'll notify you here when there are new updates or important messages.
				</p>
			</div>
		{/if}
		{#each data.notifications as n, i (n.id || i)}
			<div class="{n.seen ? '' : 'noti-new'} bg-card border group shadow rounded-lg py-3 px-5 flex gap-2 items-center justify-between hover:bg-zinc-800/80 transition duration-300 ease-out" in:fly|global={ blockAnimation ? { delay: 0, duration: 0, opacity: 1 } : { x: ((-1)**i) * 100 + '%', duration: 300, delay: i*100 }}>
				<div>
					<div class="flex gap-2">
						<h4 class="text-lg">{n.title}</h4>
						<span class="text-muted-foreground flex gap-1.5 leading-none items-center text-nowrap"><Clock class="size-4"/> {n.timeAgo}</span>
					</div>
					<p class="text-zinc-300">{n.message}</p>
				</div>
				<form method="POST" use:enhanceWithLoader
				class="actions flex gap-2 flex-col sm:flex-row justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 ease-out">
					<input type="hidden" name="id" value="{n.id}">
					<Tooltip.Provider>
						{#if n.seen}
							<Tooltip.Root>
								<Tooltip.Trigger type="submit" name="action" value="unread" class="{buttonVariants({ variant: 'ghost', size: 'icon' })} text-amber-500 hover:text-amber-500 dark:hover:bg-amber-700/10"><Undo2Icon/></Tooltip.Trigger>
								<Tooltip.Content class="hidden sm:block">Mark as unread</Tooltip.Content>
							</Tooltip.Root>
						{:else}
							<Tooltip.Root>
								<Tooltip.Trigger type="submit" name="action" value="read" class="{buttonVariants({ variant: 'ghost', size: 'icon' })} text-green-500 hover:text-green-500 dark:hover:bg-green-700/10"><CheckCheckIcon/></Tooltip.Trigger>
								<Tooltip.Content class="hidden sm:block">Mark as read</Tooltip.Content>
							</Tooltip.Root>
						{/if}
						<Tooltip.Root>
							<Tooltip.Trigger type="submit" name="action" value="delete" class="{buttonVariants({ variant: 'ghost', size: 'icon' })} text-destructive hover:text-destructive dark:hover:bg-destructive/10"><Trash2Icon/></Tooltip.Trigger>
							<Tooltip.Content class="hidden sm:block">Delete Notification</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</form>
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
<style lang="postcss">
	@reference 'tailwindcss';
	.noti-new { position: relative; overflow: hidden; }
	.noti-new::after {
		@apply absolute h-4 w-12 top-0 left-0 bg-zinc-200 text-zinc-800 -rotate-45 -translate-x-1/4 translate-y-1/4
		flex items-center justify-center leading-none font-bold text-xs;
		content: 'NEW';
	}
</style>
