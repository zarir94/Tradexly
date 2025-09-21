<script lang="ts">
	import { Trigger } from "$lib/components/ui/sidebar/index";
	import { Button } from "$lib/components/ui/button/index";
	import { 
		BellIcon, 
		SearchIcon, 
		UserIcon, 
		SettingsIcon, 
		LogOutIcon,
		ChevronDownIcon,
		WalletIcon,
		TrendingUpIcon
	} from '@lucide/svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Mock user data - replace with actual user store/data
	let user = {
		name: "John Doe",
		email: "john@example.com",
		balance: 12500.75,
		avatar: null
	};

	let showUserMenu = false;
	let showNotifications = false;
	let currentTime = new Date();

	// Update time every second
	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	// Mock notifications - replace with actual notification system
	let notifications = [
		{ id: 1, title: "Trade Executed", message: "Your EUR/USD trade was executed successfully", time: "2 min ago", unread: true },
		{ id: 2, title: "Deposit Confirmed", message: "Your deposit of $500 has been confirmed", time: "1 hour ago", unread: true },
		{ id: 3, title: "Market Alert", message: "BTC/USD reached your target price", time: "3 hours ago", unread: false }
	];

	$: unreadCount = notifications.filter(n => n.unread).length;

	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
		showNotifications = false;
	}

	function toggleNotifications() {
		showNotifications = !showNotifications;
		showUserMenu = false;
	}

	function closeMenus() {
		showUserMenu = false;
		showNotifications = false;
	}

	// Get page title based on current route
	$: pageTitle = getPageTitle($page.url.pathname);

	function getPageTitle(pathname: string): string {
		const routes: Record<string, string> = {
			'/dashboard': 'Dashboard',
			'/dashboard/trade': 'Trade Terminal',
			'/dashboard/trade-history': 'Trade History',
			'/dashboard/leaderboard': 'Leaderboard',
			'/dashboard/bonus-promo': 'Bonus & Promotions',
			'/dashboard/deposit': 'Deposit Funds',
			'/dashboard/deposit-history': 'Deposit History',
			'/dashboard/withdraw': 'Withdraw Funds',
			'/dashboard/withdraw-history': 'Withdrawal History',
			'/dashboard/transactions': 'All Transactions',
			'/dashboard/profile': 'My Profile',
			'/dashboard/security': 'Security Settings',
			'/dashboard/tutorials': 'Tutorials',
			'/dashboard/helpcenter': 'Help Center',
			'/dashboard/support': 'Support Center'
		};
		return routes[pathname] || 'Dashboard';
	}
</script>

<svelte:window on:click={closeMenus} />

<header class="bg-card border-b border-border w-full h-16 flex items-center justify-between px-4 relative z-50">
	<!-- Left Section: Sidebar Trigger + Logo + Page Title -->
	<div class="flex items-center gap-4">
		<Trigger class="sbtriggerbtn lg:hidden" />
		
		<!-- Logo and Brand -->
		<div class="hidden lg:flex items-center gap-3">
			<img src="/src/lib/assets/site-logo.png" alt="Tradexly" class="h-8 w-auto" />
			<div class="h-6 w-px bg-border"></div>
		</div>
		
		<!-- Page Title -->
		<div class="flex items-center gap-2">
			<h1 class="text-lg font-semibold text-foreground">{pageTitle}</h1>
			{#if pageTitle === 'Trade Terminal'}
				<TrendingUpIcon class="h-4 w-4 text-green-500" />
			{/if}
		</div>
	</div>

	<!-- Center Section: Search (hidden on mobile) -->
	<div class="hidden md:flex items-center flex-1 max-w-md mx-8">
		<div class="relative w-full">
			<SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<input 
				type="text" 
				placeholder="Search markets, assets..." 
				class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
			/>
		</div>
	</div>

	<!-- Right Section: Time, Balance, Notifications, User Menu -->
	<div class="flex items-center gap-2 md:gap-4">
		<!-- Current Time -->
		<div class="hidden sm:flex flex-col items-end text-xs">
			<span class="text-muted-foreground">Market Time</span>
			<span class="font-mono text-foreground">
				{currentTime.toLocaleTimeString('en-US', { 
					hour12: false, 
					hour: '2-digit', 
					minute: '2-digit',
					second: '2-digit'
				})}
			</span>
		</div>

		<!-- Account Balance -->
		<div class="hidden md:flex items-center gap-2 bg-background px-3 py-2 rounded-lg border border-border">
			<WalletIcon class="h-4 w-4 text-green-500" />
			<div class="flex flex-col">
				<span class="text-xs text-muted-foreground">Balance</span>
				<span class="text-sm font-semibold text-green-500">
					${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
				</span>
			</div>
		</div>

		<!-- Notifications -->
		<div class="relative">
			<Button 
				variant="ghost" 
				size="sm" 
				class="relative p-2"
				onclick={(e) => { e.stopPropagation(); toggleNotifications(); }}
			>
				<BellIcon class="h-5 w-5" />
				{#if unreadCount > 0}
					<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{unreadCount}
					</span>
				{/if}
			</Button>

			<!-- Notifications Dropdown -->
			{#if showNotifications}
				<div class="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
					<div class="px-4 py-2 border-b border-border">
						<h3 class="font-semibold text-sm">Notifications</h3>
					</div>
					<div class="max-h-64 overflow-y-auto">
						{#each notifications as notification}
							<div class="px-4 py-3 hover:bg-slate-800/50 cursor-pointer border-l-2 {notification.unread ? 'border-l-primary bg-primary/5' : 'border-l-transparent'}">
								<div class="flex justify-between items-start">
									<div class="flex-1">
										<p class="text-sm font-medium">{notification.title}</p>
										<p class="text-xs text-muted-foreground mt-1">{notification.message}</p>
									</div>
									<span class="text-xs text-muted-foreground ml-2">{notification.time}</span>
								</div>
							</div>
						{/each}
					</div>
					<div class="px-4 py-2 border-t border-border">
						<Button variant="ghost" size="sm" class="w-full text-xs">
							View All Notifications
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<!-- User Menu -->
		<div class="relative">
			<Button 
				variant="ghost" 
				size="sm" 
				class="flex items-center gap-2 p-2"
				onclick={(e) => { e.stopPropagation(); toggleUserMenu(); }}
			>
				<div class="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
					{#if user.avatar}
						<img src={user.avatar} alt={user.name} class="h-8 w-8 rounded-full" />
					{:else}
						<UserIcon class="h-4 w-4 text-primary" />
					{/if}
				</div>
				<div class="hidden sm:flex flex-col items-start">
					<span class="text-sm font-medium">{user.name}</span>
					<span class="text-xs text-muted-foreground">{user.email}</span>
				</div>
				<ChevronDownIcon class="h-4 w-4 transition-transform {showUserMenu ? 'rotate-180' : ''}" />
			</Button>

			<!-- User Dropdown Menu -->
			{#if showUserMenu}
				<div class="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
					<div class="px-4 py-2 border-b border-border">
						<p class="font-semibold text-sm">{user.name}</p>
						<p class="text-xs text-muted-foreground">{user.email}</p>
					</div>
					
					<div class="py-1">
						<a href="/dashboard/profile" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-800/50">
							<UserIcon class="h-4 w-4" />
							My Profile
						</a>
						<a href="/dashboard/security" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-800/50">
							<SettingsIcon class="h-4 w-4" />
							Settings
						</a>
						<a href="/dashboard/transactions" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-800/50">
							<WalletIcon class="h-4 w-4" />
							Wallet
						</a>
					</div>
					
					<div class="border-t border-border pt-1">
						<a href="/dashboard?action=logout" class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
							<LogOutIcon class="h-4 w-4" />
							Sign Out
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>

<style lang="postcss">
	@reference 'tailwindcss';
	
	/* Sidebar trigger button styling */
	header :global(.sbtriggerbtn) { 
		@apply p-2 hover:bg-slate-800/50 rounded-md transition-colors;
	}
	
	header :global(.sbtriggerbtn svg) { 
		@apply h-5 w-5;
	}

	/* Custom scrollbar for notifications */
	.max-h-64::-webkit-scrollbar {
		width: 4px;
	}
	
	.max-h-64::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.max-h-64::-webkit-scrollbar-thumb {
		background: hsl(var(--border));
		border-radius: 2px;
	}
	
	.max-h-64::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--muted-foreground));
	}
</style>
