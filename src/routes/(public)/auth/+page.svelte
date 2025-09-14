<script lang="ts">
  //@ts-nocheck
	import { page } from "$app/state";
	import { slide } from "svelte/transition";
  import SI from "$lib/assets/site-icon.png";
	import { CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "@lucide/svelte";
	import { enhance } from "$app/forms";
  export let form;
  $: curForm = page.url.searchParams.get('action') == 'register' ? 'register' : 'login';
  $: alerts = [form];
  let btnDis = 0;
</script>

<svelte:head>
  <title>Authenticate - {page.data.cached.site_name}</title>
</svelte:head>

<div class="auth cont w-full min-h-[calc(100vh-165px)] flex gap-5 items-center justify-center py-10">
  <div class="af flex flex-col gap-5 max-w-lg w-full">
    <div class="intro invisible-overlay">
      <img src="{SI}" class="max-w-28 mx-auto" alt="Tradexly">
    </div>
    {#each alerts as a}
      {#if a}
        <div class="flex items-center gap-3 px-5 py-3 rounded-lg md:text-lg is-{a.type}" transition:slide>
          {#if a.type == 'info'}
          <InfoIcon class="shrink-0 size-5 md:size-6"/>
          {:else if a.type == 'success'}
          <CircleCheckIcon class="shrink-0 size-5 md:size-6"/>
          {:else if a.type == 'error'}
          <TriangleAlertIcon class="shrink-0 size-5 md:size-6"/>
          {/if}
          <span>{a.message}</span>
        </div>
      {/if}
    {/each}
    <div class="fnav mx-auto flex gap-3 bg-slate-200/10 p-1 rounded-lg border border-slate-200/20">
      <a href="?action=login" data-active={curForm == 'login'} on:click={()=>{curForm = 'login'}}>Login</a>
      <a href="?action=register" data-active={curForm == 'register'} on:click={()=>{curForm = 'register'}}>Register</a>
    </div>
    <form action="?/{curForm}" method="POST" use:enhance={()=>{form = undefined; btnDis = 1; return ({ result, update })=>{btnDis = 0; update()}}}>
      {#if curForm == 'register'}
        <div class="mb-5" transition:slide>
          <input type="text" placeholder="Full Name" name="fullName" required>
          <span>The name shown on your national ID or passport</span>
        </div>
      {/if}
      <div class="mb-5">
        <input type="text" placeholder="{curForm == 'register' ? 'Username' : 'Username or Email'}" name="username" required>
        {#if curForm == 'register'}
          <span transition:slide>This name will be visible to other users</span>
        {/if}
      </div>
      {#if curForm == 'register'}
        <div class="mb-5" transition:slide>
          <input type="email" placeholder="Email Address" name="email" required>
          <span>Email will be used to contact you and verify your account</span>
        </div>
      {/if}
      <div class="mb-5">
        <input type="password" placeholder="Password" name="password" required>
        {#if curForm == 'register'}
          <span transition:slide>Choose a strong password with at least 8 characters</span>
        {/if}
      </div>
      {#if curForm == 'register'}
        <div class="mb-5" transition:slide>
          <input type="password" placeholder="Confirm Password" name="passwordConfirm" required>
          <span>Repeat your password to avoid mistakes</span>
        </div>
      {/if}
      <button class="uppercase w-30 h-10" disabled={btnDis}>
        {#if !btnDis}
          {curForm}
        {:else}
          <span class="block w-6 h-6 rounded-full border-white border-2 border-x-transparent animate-spin"></span>
        {/if}
      </button>
    </form>
    {#if curForm == 'login'}
      <div class="mx-auto mt-3 font-semibold" transition:slide><a class="border-b border-dotted hover:text-emerald-500 hover:border-solid" href="/auth/reset">Forgot Password</a>?</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference 'tailwindcss';
  .fnav a { @apply block w-20 text-center rounded-lg px-3 py-2 hover:bg-slate-200/10; }
  .fnav a[data-active="true"] { @apply bg-slate-200/20; }
  .af { @apply bg-slate-200/5 rounded-lg backdrop-blur-[2px] border border-slate-200/20 px-5 py-6 shadow; }
  .af input { @apply w-full bg-slate-200/10 hover:bg-slate-200/15 focus:bg-slate-200/20
    outline-1 outline-slate-200/30 focus:outline-offset-2 focus:outline-2 focus:outline-emerald-400/50
    placeholder:text-slate-100/70
    rounded-lg px-4 py-2 md:px-5 md:py-3 md:text-lg backdrop-blur-[2px] shadow transition-all duration-150 ease-out; }
  .af form span { @apply block text-sm md:text-base mt-1 ml-1 opacity-60; }
  .af button { @apply flex items-center justify-center mx-auto bg-gradient-to-r from-emerald-600 to-cyan-600 font-bold px-5 py-2 rounded-lg cursor-pointer
    hover:saturate-150 hover:brightness-125 active:scale-75 disabled:brightness-75 disabled:saturate-100 disabled:cursor-not-allowed; }
  .af :global(.is-error) { @apply bg-amber-400/40; }
  .af :global(.is-success) { @apply bg-emerald-400/30; }
  .af :global(.is-info) { @apply bg-sky-700/30; }
</style>
