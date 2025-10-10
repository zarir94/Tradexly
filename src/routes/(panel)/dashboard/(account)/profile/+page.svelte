<script>
	import { invalidateAll } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index";
  import * as Alert from "$lib/components/ui/alert/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
	import { Badge } from "$main/src/lib/components/ui/badge";
	import { Button, buttonVariants } from "$main/src/lib/components/ui/button/index.js";
	import { enhanceWithLoader } from "$main/src/lib/publicFunc.js";
	import { AtSignIcon, BadgeInfoIcon, BadgePlusIcon, CalendarPlusIcon, IdCardIcon, ListIcon, MapPinIcon, RefreshCcwIcon, RotateCwIcon, ScanFaceIcon, SquirrelIcon, UnlinkIcon, ViewIcon } from "@lucide/svelte";
	import { toast } from "svelte-sonner";
	import { Input } from "$main/src/lib/components/ui/input/index.js";
	import { Label } from "$main/src/lib/components/ui/label/index.js";
	import CountryInput from "./countryInput.svelte";
	import PictureChangeDialog from "./pictureChangeDialog.svelte";
	import { Separator } from "$lib/components/ui/separator/index";
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
  <Badge variant="secondary" class="font-bold text-sm leading-none px-2 py-1
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
        <form action="?/updateProfile" method="post" use:enhanceWithLoader={({ formData, cancel })=>{
          let d = formData.get('country');
          if (!d) {
            toast.warning('Kindly select your country as shown on the Government Documents');
            cancel();
          }
        }}>
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <Label for="up-name">Full Name</Label>
              <Input id="up-name" type="text" name="fullName" value={data.usrData.fullName} required/>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="up-user">Username</Label>
              <Input id="up-user" type="text" name="username" value={data.usrData.username} required/>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="up-email">Email Address</Label>
              <Input id="up-email" type="email" name="email" value={data.usrData.email} readonly disabled/>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="up-country">Country</Label>
              <CountryInput name="country" value={data.usrData.country || ''}/>
            </div>
            <div class="flex justify-center">
              <Button type="submit"><SquirrelIcon/><span>Update Profile</span></Button>
            </div>
          </div>
        </form>
      </Card.Content>
      <Card.Footer>
        <PictureChangeDialog/>
      </Card.Footer>
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
          <div class="space-y-6">
            <div class="p-5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Current Status</span>
                  <p class="text-xs text-zinc-500 mt-1">Overall verification progress</p>
                </div>
                {@render StatusBadge(data.usrData.kyc.status)}
              </div>

              {#if Object.keys(data.usrData.kyc.steps).length > 0}
                <div class="border-t border-zinc-700 pt-4">
                  <div class="mb-3">
                    <span class="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Progress Details</span>
                    <p class="text-xs text-zinc-500 mt-1">Individual step completion</p>
                  </div>
                  <div class="space-y-3">
                    {#each Object.entries(data.usrData.kyc.steps) as [k, v], i (k || i)}
                      {@const n = k.replaceAll('_', ' ')}
                      <div class="flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-900/50 border border-zinc-600">
                        <div>
                          <span class="capitalize text-sm font-medium text-zinc-200">{n}</span>
                          <p class="text-xs text-zinc-500 mt-0.5">Step {i + 1} of {Object.keys(data.usrData.kyc.steps).length}</p>
                        </div>
                        {@render StatusBadge(v)}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
            {#if data.usrData.kyc.status != 'Declined' && data.usrData.kyc.status != 'In Review' && data.usrData.kyc.status != 'Approved'}
              <div class="flex justify-center pt-2">
                <Button variant="default" href={data.usrData.kyc.url} target="_blank">
                  <UnlinkIcon class="size-4"/>
                  Continue KYC Process
                </Button>
              </div>
            {/if}
            {#if data.usrData.kyc.status == 'In Review'}
              <Alert.Root class="text-purple-400">
                <BadgeInfoIcon/>
                <Alert.Title class="font-semibold">KYC Review In Progress</Alert.Title>
                <Alert.Description class="text-inherit opacity-90">Your KYC submission is currently under manual review. If the process is not completed within 24 hours, please consider opening a support ticket for further assistance.</Alert.Description>
              </Alert.Root>
            {/if}
          </div>
        {:else}
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <div class="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <ListIcon class="w-5 h-5 text-blue-400"/>
              </div>
              <h4 class="text-lg font-semibold text-foreground">What You'll Need for KYC</h4>
            </div>

            <div class="grid gap-3">
              <div class="kycItem">
                <div class="kycIcon bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
                  <IdCardIcon class="w-4 h-4 text-emerald-400"/>
                </div>
                <div class="flex-1">
                  <div class="kycTitle">Government ID</div>
                  <div class="kycDesc">National ID (NID), Passport, Driving Licence, or other government-issued ID</div>
                </div>
              </div>

              <div class="kycItem">
                <div class="kycIcon bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
                  <ScanFaceIcon class="w-4 h-4 text-purple-400"/>
                </div>
                <div class="flex-1">
                  <div class="kycTitle">Face Match</div>
                  <div class="kycDesc">Your photo compared with your ID document</div>
                </div>
              </div>

              <div class="kycItem">
                <div class="kycIcon bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
                  <ViewIcon class="w-4 h-4 text-orange-400"/>
                </div>
                <div class="flex-1">
                  <div class="kycTitle">Liveness Check</div>
                  <div class="kycDesc">A quick scan to confirm you are present and real</div>
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-zinc-800/10 border border-blue-500/20">
              <div class="flex flex-wrap items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span class="text-blue-300 font-medium">Secure & Private</span>
                <span class="text-muted-foreground">• All data is encrypted and never stored</span>
              </div>
            </div>
          </div>
        {/if}
        {#if !data.usrData.kyc || data.usrData.kyc.status == 'Declined' || data.usrData.kyc.status == 'In Review'}
          <form action="?/createKYC" class="mt-5 flex justify-center" method="post" use:enhanceWithLoader>
            <Button type="submit" variant="{!data.usrData.kyc ? 'default' : 'outline'}">
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
  <Separator class="my-5"/>
  <div class="flex justify-end">
    <AlertDialog.Root>
      <AlertDialog.Trigger class="{buttonVariants({ variant: "destructive" })}">
        Delete Your Account
      </AlertDialog.Trigger>
      <AlertDialog.Content interactOutsideBehavior="close">
        <AlertDialog.Header>
          <AlertDialog.Title>Permanently Delete Account?</AlertDialog.Title>
          <AlertDialog.Description>
            This will permanently delete your account and all associated data. You will lose access to all saved information. Please confirm to proceed.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
          <form class="flex flex-col" action="?/deleteAccount" method="post" use:enhanceWithLoader>
            <AlertDialog.Action type="submit" class={buttonVariants({variant: 'destructive'})}>
              <span>Delete</span>
            </AlertDialog.Action>
          </form>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</div>


<style lang="postcss">
  @reference 'tailwindcss';
  img { color: transparent }
  .dc > div { @apply flex gap-2 items-center opacity-80; }
  .dc > div > :global(svg) { @apply size-4; }
  .dc > div > h5 { @apply text-base; }
  .kycItem { @apply flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors; }
  .kycIcon { @apply p-2 rounded-md border mt-0.5; }
  .kycTitle { @apply font-medium text-[var(--foreground)] mb-1; }
  .kycDesc { @apply text-sm text-[var(--muted-foreground)] leading-relaxed; }
</style>
