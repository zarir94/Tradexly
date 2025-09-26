<script>
  //@ts-nocheck
	import * as Popover from "$lib/components/ui/popover/index";
	import { Button, buttonVariants } from "$lib/components/ui/button/index";
	import { afterNavigate, invalidateAll } from "$app/navigation";
  import { Badge } from "$lib/components/ui/badge/index";
	import { BellIcon, CircleAlertIcon, MailCheckIcon } from "@lucide/svelte";
	import { page } from "$app/stores";
	import { Separator } from "$main/src/lib/components/ui/separator/index";
	import { Skeleton } from "$main/src/lib/components/ui/skeleton/index";
	import { toast } from "svelte-sonner";
	import * as Alert from "$main/src/lib/components/ui/alert/index";
	import { tick } from "svelte";
  $: unseenCount = $page.data.unseenNotificationCount;
  let open = false;
  let refreshKey = 1;
  afterNavigate(()=>{ open = false });
  async function markAllRead() {
    this?.setAttribute('disabled', "true");
    this?.classList.add('isLoading');
    let rv = ()=>{
      this?.removeAttribute('disabled');
      this?.classList.remove('isLoading');
    }
    let r = await fetch('/dashboard/api-markAllNotificationsSeen', { method: 'POST' }).then(r=>r.ok ? r.json() : false);
    if (!r) { rv(); return toast.error('Something went wrong. Unable to mark all notifications as read.') }
    refreshKey = Math.floor(Math.random() * 1e5);
    await invalidateAll();
    await tick();
    rv();
  }
</script>

{#snippet notification(nitem)}
  <div class="flex gap-1 {nitem?.seen ?? true ? '' : 'border-l-2 border-l-accent-foreground bg-primary/5'} px-3 py-2 border-b border-b-primary/10">
    <div class="flex flex-col w-full gap-1">
      <div class="flex gap-1 justify-between items-center">
        {#if nitem}
          <h4 class="text-sm">{nitem?.title}</h4>
          <span class="text-xs text-muted-foreground">{nitem?.time}</span>
        {:else}
          <Skeleton class="h-3 mb-2 rounded-sm bg-muted-foreground/30" style="width: {Math.floor(Math.random() * (100 - 70 + 1)) + 70}px"/>
          <Skeleton class="h-3 mb-1 rounded-sm bg-muted-foreground/30" style="width: 35px"/>
        {/if}
      </div>
      {#if nitem}
        <p class="text-xs text-primary/70">{nitem?.message}</p>
      {:else}
        <Skeleton class="h-3 mb-1 rounded-sm bg-muted-foreground/30" style="width: {Math.floor(Math.random() * (240 - 120 + 1)) + 120}px"/>
      {/if}
    </div>
  </div>
{/snippet}

<Popover.Root bind:open>
  <Popover.Trigger class="{buttonVariants({variant: 'ghost', size: 'icon'})} cursor-pointer relative">
    <BellIcon class="size-5"/>
    {#if unseenCount}
      {#each { length: 2 } as _, i}
        <Badge variant="destructive" class="absolute right-0 top-0 rounded-full aspect-square tabular-nums leading-none
        {unseenCount > 9 ? 'px-0.5' : 'px-1'} {i == 0 ? 'animate-ping' : ''}
        ">{unseenCount > 99 ? 99 : unseenCount}</Badge>
      {/each}
    {/if}
  </Popover.Trigger>
  <Popover.Content class="px-0 py-3" align="end">
    <div class="flex justify-between items-center px-3">
      <h3 class="text-lg font-bold">Notifications</h3>
      {#if unseenCount}
        <Button variant="ghost" size="sm" class="text-primary/90" onclick={markAllRead}><MailCheckIcon/> <span>All Read</span></Button>
      {/if}
    </div>
    <Separator class="mt-1"/>
    <div class="max-h-[285px] overflow-y-auto">
      {#key refreshKey}
      {#await fetch('/dashboard/api-getNotifications', { method: 'POST' }).then(r=>r.ok ? r.json() : false)}
        {#each { length: 5 } as _}{@render notification()}{/each}
        {:then r}
        {#if r && r.length}
        {#each r as n}{@render notification(n)}{/each}
        {:else if r.length == 0}
          <Alert.Root class="border-0 items-center justify-center text-center">
            <Alert.Title class="text-base">No Notifications Yet</Alert.Title>
            <Alert.Description>You’re all caught up! New updates and alerts will appear here.</Alert.Description>
          </Alert.Root>
        {:else}
          <Alert.Root variant="destructive" class="border-0 items-center">
            <CircleAlertIcon class="size-6 shrink-0"/>
            <Alert.Title class="text-base">Can’t Load Notifications</Alert.Title>
            <Alert.Description>We’re having trouble fetching your notifications right now. Please refresh or try again in a little while.</Alert.Description>
          </Alert.Root>
        {/if}
      {/await}
      {/key}
    </div>
    <Separator class="mb-2"/>
    <div class="px-3">  
      <Button variant="ghost" class="w-full" href="/dashboard/notifications">View All Notifications</Button>
    </div>
  </Popover.Content>
</Popover.Root>

<style lang="postcss">
  @reference 'tailwindcss';
</style>