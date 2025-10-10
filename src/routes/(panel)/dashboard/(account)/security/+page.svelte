<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
  import * as Card from "$lib/components/ui/card";
	import { Badge } from "$main/src/lib/components/ui/badge/index.js";
	import { Button } from "$main/src/lib/components/ui/button";
	import { Input } from "$main/src/lib/components/ui/input";
	import { Label } from "$main/src/lib/components/ui/label";
	import { Skeleton } from "$main/src/lib/components/ui/skeleton/index.js";
	import { enhanceWithLoader } from "$main/src/lib/publicFunc";
	import { ChevronLeft, ChevronRight, ClockIcon, HammerIcon, KeyRoundIcon, MapPinIcon, MonitorSmartphoneIcon, MonitorXIcon, ServerIcon } from "@lucide/svelte";
	import { toast } from "svelte-sonner";

  export let data;
  export let form;

  $: sessions = data.sessions.map(p=>({...p, location: undefined as string | undefined | null}));
  
  $: if (browser && sessions.length && !sessions.find(l=>l.location)) {
    fetch('http://ip-api.com/batch', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(sessions.map(t=>({ query: t.ip_address, fields: 'city,country,query'}))) })
    .then(async (r)=>{
      if (!r.ok) throw new Error(`API Error. Status: ${r.status}. Resp: ${await r.text()}`);
      let d = await r.json();
      let locs = Object.fromEntries(d.map((p: { query: string, country: string | undefined, city: string | undefined })=>{
        let lc = [p.city, p.country].filter(Boolean).join(', ');
        return [p.query, lc || 'N/A'];
      }));
      sessions = sessions.map(q=>({...q, location: locs[q.ip_address || ''] || 'N/A'}));
    }).catch((e)=>{
      console.error(e);
      sessions = sessions.map(q=>({...q, location: q.location || null}));
    })
  }
  
  $: if (form?.msg) {
		(form?.success ? toast.success : toast.error)(form?.msg)
	}

  function getUpdatedUrl(paramName: string, paramValue: any) {
		let url = new URL($page.url.toString());
		url.searchParams.set(paramName, paramValue);
		return url.search;
	}
</script>

<svelte:head>
  <title>Security Settings - {data.cached.site_name}</title>
</svelte:head>

<div class="p-3 md:p-4 lg:p-5 secPage">
  <Card.Root>
    <Card.Header>
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 p-2 rounded-md">
          <KeyRoundIcon class="text-primary size-5"/>
        </div>
        <div>
          <Card.Title class="text-xl md:text-2xl">Change Password</Card.Title>
          <Card.Description>Update your account password to keep your account secure</Card.Description>
        </div>
      </div>
    </Card.Header>
    <Card.Content>
      <form class="" action="?/changePassword" method="post" use:enhanceWithLoader>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <Label for="currentPassword">Current Password</Label>
            <Input type="password" id="currentPassword" name="currentPassword" placeholder="Enter your current password" aria-invalid={form?.fields?.includes('currentPassword')} required/>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="newPassword">New Password</Label>
            <Input type="password" id="newPassword" name="newPassword" placeholder="Enter a strong password" aria-invalid={form?.fields?.includes('newPassword')} required/>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="confirmPassword">Confirm New Password</Label>
            <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your new password" aria-invalid={form?.fields?.includes('confirmPassword')} required/>
          </div>
          <div class="flex">
            <Button type="submit"><span>Change Password</span></Button>
          </div>
        </div>
      </form>
    </Card.Content>
    <Card.Footer>
      <Button variant="link" class="!p-0 h-auto" href="/auth/reset"><HammerIcon/> Forgot Password? Reset here</Button>
    </Card.Footer>
  </Card.Root>
  <div class="my-5"></div>
  <Card.Root>
    <Card.Header>
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 p-2 rounded-md">
          <MonitorSmartphoneIcon class="text-primary size-5"/>
        </div>
        <div>
          <Card.Title class="text-xl md:text-2xl">Active Sessions</Card.Title>
          <Card.Description>Manage your active sessions across different devices and locations</Card.Description>
        </div>
      </div>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-4">
        {#each sessions as s, i (s.id || i) }
          <div class="bg-zinc-800/30 border py-3 px-5 rounded-lg flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div class="flex flex-col gap-1 w-full">
              <div class="flex items-center gap-2">
                <h1 class="text-xl">{s.device}</h1>
                {#if s.isCurrent}
                  <Badge>Current</Badge>
                {/if}
              </div>
              <div class="flex items-center gap-2 opacity-80 text-sm"><ClockIcon class="size-4"/> <span>{s.createdAt.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '')}</span></div>
              <div class="flex items-center gap-2 opacity-80 text-sm">
                <MapPinIcon class="size-4"/>
                {#if s.location == undefined}
                  <Skeleton class="w-28 h-[1.43em] bg-zinc-800"/>
                {:else if s.location == null}
                  <Badge variant="destructive" class="px-1.5 leading-none min-h-[1.67em]">ERROR</Badge>
                {:else}
                  <span>{s.location}</span>
                {/if}
              </div>
              <div>
                <Button class="!p-0 h-auto opacity-80 text-sm" variant="link" target="_blank" href="https://ipinfo.io/{s.ip_address}"><ServerIcon class="size-4"/> {s.ip_address}</Button>
              </div>
            </div>
            {#if !s.isCurrent}
            <div class="">
              <form action="?/terminateSession" method="post" use:enhanceWithLoader>
                <input type="hidden" name="id" value="{s.id}">
                <Button variant="ghost" class="text-destructive bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20" type="submit"><span>Terminate Session</span></Button>
              </form>
            </div>
            {/if}
          </div>
        {/each}
        {#if sessions.length == 0}
          <div class="flex flex-col gap-5 my-10">
            <div class="p-3 rounded-lg bg-primary/10 mx-auto"><MonitorXIcon class="size-8"/></div>
            <div class="text-center text-xl font-semibold opacity-80">No active sessions found{data.page == 1 ? '.' : ' on this page.'}</div>
          </div>
        {/if}
      </div>
    </Card.Content>
    <Card.Footer>
      <div class="flex gap-3 w-full" class:hidden={data.page == 1 && !data.hasNext}>
        <Button size="icon" href="{getUpdatedUrl('page', data.page - 1)}" class="mr-auto {data.page > 1 ? '' : 'invisible'}"><ChevronLeft class="size-5"/></Button>
        <div class="flex-1 flex justify-center">
          <span class="px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md">Page {data.page}</span>
        </div>
        <Button size="icon" href="{getUpdatedUrl('page', data.page + 1)}" class="ml-auto {data.hasNext ? '' : 'invisible'}"><ChevronRight class="size-5"/></Button>
      </div>
    </Card.Footer>
  </Card.Root>
</div>
