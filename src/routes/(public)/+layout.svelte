<script lang="ts">
	//@ts-nocheck
	import SL from "$lib/assets/site-logo.png";
	import SI from "$lib/assets/site-icon.png";
	import Rocket from "@lucide/svelte/icons/rocket";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import XIcon from "@lucide/svelte/icons/x";
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { fly } from "svelte/transition";
	import { afterNavigate } from "$app/navigation";
	import Background from "./background.svelte";
	export let children;
	let locals = {};
	let HMENU = {
		'About us': '/about',
		'Contact': '/contact',
		'FAQ': '/faq',
		'TOS': '/legal/terms-of-service'
	};
	let FMENU = {
		'Privacy Policy': '/legal/privacy-policy',
		'Risk Disclaimer': '/legal/risk-disclaimer',
		'FAQ': '/faq'
	}
	$: if (locals.showMenu) {
		locals.window?.document?.documentElement?.classList?.add('overflow-hidden')
	} else {
		locals.window?.document?.documentElement?.classList?.remove('overflow-hidden')
	}

	onMount(()=>{
		locals.window = window;
		let BS = _=>locals.scrollY = window.scrollY;
		BS();
		window.addEventListener('scroll', BS);
		return ()=>{
			window.removeEventListener('scroll', BS);
		}
	})
	afterNavigate(()=>{
		locals.showMenu = false;
	})
</script>

<Background/>

<div class="w-full h-full text-white">
	<div class="max-w-screen-2xl mx-auto header-container p-1 sm:p-1.5 md:p-2 lg:p-3 sticky top-0 left-0 z-30">
		<header class="w-full h-14 {locals.scrollY > 60 ? 'bg-white/10 backdrop-blur-xl dwnd' : 'upd'} rounded-xl px-3 py-2 flex justify-between items-center transition-all duration-300 ease-out">
			<button class="md:hidden flex items-center mr-3 cursor-pointer" on:click={()=>locals.showMenu = true}>
				<MenuIcon></MenuIcon>
			</button>
			<a class="block sla h-full invisible-overlay active:scale-75 fadeDown mr-auto md:mr-0" href="/">
				<img src="{SL}" alt="Site Logo" class="h-full">
			</a>
			<div class="hidden md:flex gap-3 md:gap-4 lg:gap-5 xl:gap-6">
				{#each Object.entries(HMENU) as [n, l], i}
					<a href="{l}" class="hml
					text-slate-100 text-xl font-semibold fadeDown
					hover:text-emerald-400 hover:-translate-y-1
					" style="animation-delay: {(i+1)*300}ms;" aria-current="{page.url.pathname == l ? 'true' : 'false'}">{n}</a>
				{/each}
			</div>
			<a href="/auth" style="animation-delay: {(Object.keys(HMENU).length + 1)*300}ms;" class="bg-transparent fadeDown px-3 py-1.5 rounded-lg my-auto font-bold gs hover:shadow-emerald-900 hover:shadow-md outline-2 outline-emerald-600 flex items-center gap-2 text-emerald-400 hover:text-white active:scale-75 hover:bg-emerald-600" >
				Get Started
				<Rocket class="transition duration-300 ease-out" size=20></Rocket>
			</a>
		</header>
	</div>
	{@render children?.()}
	<footer class="max-w-screen-2xl mx-auto mt-5 px-3 sm:px-4 md:px-5 py-5 flex gap-2 flex-col sm:flex-row items-center justify-center sm:justify-between">
		<div class="copyright">
			&copy; Copyright <a class="font-semibold hover:text-emerald-400" href="/">{page.data.cached.site_name}</a> {new Date().getUTCFullYear()} - All Rights Reserved
		</div>
		<div class="fmenu flex gap-5">
			{#each Object.entries(FMENU) as [n, l], i}
				{@const isActive = page.url.pathname == l}
				<a href="{l}" class="border-b border-dashed {isActive ? 'text-emerald-400' : 'hover:text-emerald-400'}">{n}</a>
			{/each}
		</div>
	</footer>
</div>
<!-- Mobile Menu -->
{#if locals.showMenu}
<div class="backdrop-blur-xl backdrop-brightness-50 w-screen h-screen fixed top-0 left-0 z-40 px-4 text-white" transition:fly={{x: -window?.screen?.width || -300, duration: 300}}>
	<div class="h-15 flex items-center justify-start">
		<button class="cursor-pointer" in:fly={{delay: 300, x: -200}} on:click={()=>locals.showMenu = false}>
			<XIcon size=28></XIcon>
		</button>
	</div>
	<div class="w-full h-28 invisible-overlay flex justify-center" in:fly={{delay: 300, x: -200}}>
		<img src="{SI}" alt="Site Icon">
	</div>
	<div class="flex flex-col gap-3 mt-10">
		{#each Object.entries(HMENU) as [n, l], i}
			<a href="{l}" class="mml hml max-w-min mx-auto text-nowrap
			text-slate-100 text-2xl font-semibold
			hover:text-emerald-400
			" in:fly|global={{delay: (i+1)*300, x: -200}} aria-current="{page.url.pathname == l ? 'true' : 'false'}">{n}</a>
		{/each}
	</div>
</div>
{/if}


<style lang="postcss">
	@reference 'tailwindcss';
	@media (width < 40rem) {
		.gs { animation-delay: 300ms !important; }
	}
	.gs:hover > :global(svg) {
		transform: rotate(42deg);
	}
	.hml[aria-current="true"] {
		position: relative;
		color: theme(--color-emerald-400);
	}
	.hml[aria-current="true"] {
		&::after, &::before {			
			content: "";
			position: absolute;
			border-radius: 999999999px;
			background-color: theme(--color-emerald-400);
			width: 7px;
			height: 7px;
			bottom: -7px;
			left: calc(50% - 3.5px);
		}
		&::after { @apply animate-ping; }
	}
	.hml.mml {
		&::after, &::before {
			bottom: calc(50% - 3.5px);
			left: calc(100% + 7px);
		}
	}
	.sla img { --ds: drop-shadow(0px 0px 3px theme(--color-emerald-800)); filter: var(--ds); -webkit-filter: var(--ds); }
	.upd .sla { @apply scale-[120%] translate-x-[10%] sm:scale-[140%] sm:translate-x-[20%] lg:scale-[160%] lg:translate-x-[30%]; }
	.dwnd .sla { @apply scale-[110%] translate-x-[5%] sm:scale-[120%] sm:translate-x-[10%] lg:scale-[130%] lg:translate-x-[15%]; }
</style>