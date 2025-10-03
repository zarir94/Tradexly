<script>
	import { invalidateAll } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index";
	import { Badge } from "$main/src/lib/components/ui/badge";
	import { Button } from "$main/src/lib/components/ui/button/index.js";
	import { enhanceWithLoader } from "$main/src/lib/publicFunc.js";
	import { AtSignIcon, BadgePlusIcon, CalendarPlusIcon, MapPinIcon, RefreshCcwIcon, RotateCwIcon } from "@lucide/svelte";
	import { toast } from "svelte-sonner";
  export let data;
  export let form;

  $: if (form?.msg) {
		(form?.success ? toast.success : toast.error)(form?.msg)
	}
</script>

<svelte:head>
  <title>Profile - {data.cached.site_name}</title>
</svelte:head>

{#snippet StatusBadge(/** @type {string} */ text)}
  <Badge variant="secondary" class="font-bold text-sm leading-none
  {
  text == 'Not Started' ? 'bg-zinc-600' :
  text == 'Not Finished' ? 'bg-orange-600' :
  text == 'In Progress' ? 'bg-blue-500' :
  text == 'In Review' ? 'bg-purple-600' :
  text == 'Approved' ? 'bg-emerald-600' :
  text == 'Declined' ? 'bg-red-600' :
  text == 'Pending' ? 'bg-amber-600' : ''
  }
  ">{text}</Badge>
{/snippet}

<div class="p-3 md:p-4 lg:p-5 profPage">
  <Card.Root>
    <Card.Content>
      <div class="mc flex gap-5 flex-wrap justify-around items-center">
        <div class="tc flex gap-3 md:gap-5 items-center">
          <div class="relative w-min">
            <div class="w-32 h-32 rounded-full overflow-hidden">
              <img src="{data.usrData.img}" alt="{data.usrData.fullName}">
            </div>
            <div class="p-1 rounded-full bg-emerald-400 border-card border-5 w-min absolute bottom-1 right-1">
              <div class="w-3 h-3 rounded-full bg-card"></div>
            </div>
          </div>
          <div class="nc">
            <h2 class="text-2xl md:text-3xl font-semibold tracking-wide">{data.usrData.fullName}</h2>
            <h3 class="text-xl md:text-2xl text-muted-foreground">@{data.usrData.username}</h3>
          </div>
        </div>
        <div class="dc flex flex-col gap-2">
          <div>
            <AtSignIcon/>
            <h5>{data.usrData.email}</h5>
          </div>
          <div>
            <CalendarPlusIcon/>
            <h5>{new Date(data.usrData.createdAt).toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' })}</h5>
          </div>
          <div>
            <MapPinIcon/>
            <h5>{data.usrData.country || 'Unknown'}</h5>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <div class="my-5"></div>
  <div class="sd2 flex flex-col lg:flex-row items-start gap-5">
    <Card.Root class="w-full lg:max-w-1/2">
      <Card.Header>
        <Card.Title class="text-xl">Account Details</Card.Title>
        <Card.Description>Review and manage your personal information associated with your account.</Card.Description>
      </Card.Header>
      <Card.Content>
        Personal Info
      </Card.Content>
    </Card.Root>

    <Card.Root class="w-full lg:max-w-1/2">
      <Card.Header>
        <Card.Title class="text-xl flex items-center justify-between">
          <span>Identity Verification (KYC)</span>
          <Button variant="ghost" size="icon" class="disabled:animate-spin" onclick={async function () { this.disabled = true; await invalidateAll(); this.disabled = false }}><RotateCwIcon/></Button>
        </Card.Title>
        <Card.Description>Secure your account and unlock full platform features by completing the Know Your Customer (KYC) process.</Card.Description>
      </Card.Header>
      <Card.Content>
        {#if data.usrData.kyc}
          <p>Status</p>
        {:else}
          <p>Steps for KYC Completion</p>
        {/if}
        {#if !data.usrData.kyc || data.usrData.kyc.status == 'Declined'}
          <form action="?/createKYC" method="post" use:enhanceWithLoader>
            <Button type="submit">
              {#if !data.usrData.kyc}
                <BadgePlusIcon/>
                <span>Create KYC Session</span>
              {:else}
                <RefreshCcwIcon/>
                <span>Restart KYC Session</span>
              {/if}
            </Button>
          </form>
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>


<style lang="postcss">
  @reference 'tailwindcss';
  img { color: transparent }
  .dc > div { @apply flex gap-2 items-center opacity-80; }
  .dc > div > :global(svg) { @apply size-4; }
  .dc > div > h5 { @apply text-base; }
</style>