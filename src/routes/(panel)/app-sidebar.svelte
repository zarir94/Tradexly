<script lang="ts">
	//@ts-nocheck
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import * as Collapsible from "$lib/components/ui/collapsible/index";
	import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, BellIcon, BookOpenTextIcon, ChartCandlestickIcon, ChartLineIcon, ChevronDown, CircleUserRoundIcon, FileInputIcon, FileOutputIcon, GiftIcon, GraduationCapIcon, HeadsetIcon, HistoryIcon, IdCardIcon, MessageCircleQuestionIcon, PowerIcon, ShieldIcon, TicketCheckIcon, TrophyIcon, WalletIcon } from '@lucide/svelte';
	import SL from '$lib/assets/site-logo.png';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	$: path = $page.url.pathname;
	let menu_items = [
		['Trading', '#', ChartLineIcon, [
			['Trade Terminal', '/dashboard/trade', ChartCandlestickIcon],
			['Trade History', '/dashboard/trade-history', HistoryIcon],
			['Leaderboard', '/dashboard/leaderboard', TrophyIcon],
			['Bonus & Promo', '/dashboard/bonus-promo', GiftIcon]
		]],
		
		['Wallet', '#', WalletIcon, [
			['Deposit Funds', '/dashboard/deposit', BanknoteArrowUpIcon],
			['Deposit History', '/dashboard/deposit-history', FileInputIcon],
			['Withdraw Funds', '/dashboard/withdraw', BanknoteArrowDownIcon],
			['Withdrawal History', '/dashboard/withdraw-history', FileOutputIcon],
			['All Transactions', '/dashboard/transactions', TicketCheckIcon]
		]],

		['Account', '#', CircleUserRoundIcon, [
			['My Profile', '/dashboard/profile', IdCardIcon],
			['Security Settings', '/dashboard/security', ShieldIcon],
			['Notifications', '/dashboard/notifications', BellIcon]
		]],

		['Resources', '#', BookOpenTextIcon, [
			['Tutorials', '/dashboard/tutorials', GraduationCapIcon],
			['Help Center', '/dashboard/helpcenter', MessageCircleQuestionIcon],
			['Support Center', '/dashboard/support', HeadsetIcon]
		]]
	];
	$: [mi, smi] = menu_items.map((m, i)=>{
		if (m[1].startsWith(path)) {return [i, null]}
		if (m[3]) {
			let si = m[3].map((s, j)=>{
				if (s[1].startsWith(path)) {return j}
				return null;
			}).filter(p=>Number.isFinite(p))[0];
			if (Number.isFinite(si)) {return [i, si]}
		}
		return [null, null];
	}).filter(([r])=>Number.isFinite(r))[0];
	let openCount : 'single' | 'multiple' = 'multiple';
	let defaultOpen = true; // Must set false if single
	$: locals = { ms: Object.fromEntries(menu_items.map((_, i)=>(mi == i ? [i, true] : [i, defaultOpen]))) };
  $: sidebar = Sidebar.useSidebar();
  afterNavigate(()=>{
		sidebar.setOpenMobile(false);
	})
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center justify-center relative after:absolute after:w-full after:h-full after:top-0 after:left-0">
			<img class="w-42" src="{SL}" alt="{$page.data.cached.site_name}">
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each menu_items as [name, url, icon, submenu], i}
						{#if submenu}
							<Collapsible.Root class="group/collapsible" bind:open={locals.ms[i]} onOpenChange={()=>{if (openCount == 'single') { Object.keys(locals.ms).map(p=>{if (p != i) {locals.ms[p] = !1}}) }}}>
								<Sidebar.MenuItem>
									<Collapsible.Trigger>
										{#snippet child({ props })}
											<Sidebar.MenuButton {...props}>
												{#snippet child({ props })}
													<a href="{url}" on:click|preventDefault={()=>{return false}} {...props} data-svtpxplopes="menu">
														{#if icon}<svelte:component this={icon}></svelte:component>{/if}
														<span>{name}</span>
														<ChevronDown class="ml-auto transition-transform duration-300 ease-linear group-data-[state=open]/collapsible:rotate-180"/>
													</a>
												{/snippet}
											</Sidebar.MenuButton>
										{/snippet}
									</Collapsible.Trigger>
									<Collapsible.Content forceMount>
										{#snippet child({ props, open })}
											{#if open}
												<div {...props} transition:slide={{ duration: 300 }}>
													<Sidebar.MenuSub>
														{#each submenu as [sname, surl, sicon], j}
															<Sidebar.MenuSubItem>
																<Sidebar.MenuSubButton isActive={j == smi && i == mi}>
																	{#snippet child({ props })}
																		<a href="{surl}" {...props} data-svtpxplopes="submenu">
																			{#if sicon}<svelte:component this={sicon}></svelte:component>{/if}
																			<span>{sname}</span>
																		</a>
																	{/snippet}
																</Sidebar.MenuSubButton>
															</Sidebar.MenuSubItem>
														{/each}
													</Sidebar.MenuSub>
												</div>
											{/if}
										{/snippet}
									</Collapsible.Content>
								</Sidebar.MenuItem>
							</Collapsible.Root>
						{:else}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={i == mi}>
								{#snippet child({ props })}
									<a href="{url}" {...props} data-svtpxplopes="menu">
										{#if icon}<svelte:component this={icon}></svelte:component>{/if}
										<span>{name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

<style lang="postcss">
	@reference 'tailwindcss';
	a[data-svtpxplopes="menu"] span, a[data-svtpxplopes="submenu"] span { @apply text-base tracking-wide; }
	a[data-svtpxplopes="menu"] :global(svg):first-child, a[data-svtpxplopes="submenu"] :global(svg):first-child { @apply size-5; }
</style>
