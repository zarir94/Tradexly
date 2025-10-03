<script>
	import { BanknoteArrowUpIcon, HistoryIcon, IdCardIcon, LogOutIcon, ShieldIcon } from "@lucide/svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
	import * as Popover from "$lib/components/ui/popover/index";
	import { buttonVariants } from "$lib/components/ui/button/index";
	import { Button } from "$main/src/lib/components/ui/button/index";
	import { Separator } from "$lib/components/ui/separator/index";
	import { page } from "$app/stores";
	import { toast } from "svelte-sonner";
	import { afterNavigate } from "$app/navigation";
	import { Badge } from "$main/src/lib/components/ui/badge";
  let open = false;
  afterNavigate(()=>{ open = false });
</script>

<Popover.Root bind:open>
  <Popover.Trigger class="{buttonVariants({variant: 'ghost'})} p-1 rounded-full h-full sm:px-2 sm:rounded-md cursor-pointer">
    <img class="h-full rounded-full" src="{$page.data.user.img}" alt="{$page.data.user.fullName}">
    <div class="hidden sm:flex flex-col text-left">
      <span class="truncate">{$page.data.user.fullName}</span>
      <span class="truncate text-muted-foreground">{$page.data.user.email}</span>
    </div>
  </Popover.Trigger>
  <Popover.Content class="w-56 px-0 py-3" align="end">
    <div class="flex gap-3 items-center px-3">
      <img class="h-10 w-10 rounded-full text-transparent border" src="{$page.data.user.img}" alt="{$page.data.user.fullName}">
      <div class="flex flex-col text-left">
        <span class="truncate" style="--w: 145px">{$page.data.user.fullName}</span>
        <button class="truncate text-muted-foreground hover:text-white/80 cursor-pointer outline-0" style="--w: 145px" on:click={()=>{ navigator.clipboard ?  navigator.clipboard?.writeText($page.data.user.email).then(_=>toast.success('Email copied to clipboard')).catch(e=>toast.error('Cannot access clipboard. Error: ' + (e?.message || 'Unknown'))) : toast.error('Cannot access clipboard.')}}>{$page.data.user.email}</button>
        <Badge variant="secondary" class="font-semibold leading-none {$page.data.user.kyc_valid ? 'bg-emerald-800' : 'bg-amber-800'}">{$page.data.user.kyc_valid ? 'Verified' : 'Not Verified'}</Badge>
      </div>
    </div>
    <Separator class="my-2"/>
    <div class="flex flex-col">
      <Button variant="ghost" class="rounded-none justify-start" href="/dashboard/trade-history"><HistoryIcon/> Trade History</Button>
      <Button variant="ghost" class="rounded-none justify-start" href="/dashboard/deposit"><BanknoteArrowUpIcon/> Deposit Funds</Button>
      <Button variant="ghost" class="rounded-none justify-start" href="/dashboard/profile"><IdCardIcon/> My Profile</Button>
      <Button variant="ghost" class="rounded-none justify-start" href="/dashboard/security"><ShieldIcon/> Security Settings</Button>
      <Separator class="my-1"/>
      <AlertDialog.Root>
        <AlertDialog.Trigger class="{buttonVariants({ variant: "ghost" })} rounded-none justify-start text-destructive hover:text-destructive dark:hover:bg-destructive/10">
          <LogOutIcon/> Logout
        </AlertDialog.Trigger>
        <AlertDialog.Content interactOutsideBehavior="close">
          <AlertDialog.Header>
            <AlertDialog.Title>Log out of your account?</AlertDialog.Title>
            <AlertDialog.Description>
              You will be signed out of this session. You can log back in at any time using your credentials.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <form action="/dashboard">
              <input type="hidden" name="action" value="logout">
              <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
              <AlertDialog.Action type="submit" class={buttonVariants({variant: 'destructive'})}>Log Out</AlertDialog.Action>
            </form>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  </Popover.Content>
</Popover.Root>

<style lang="postcss">
  @reference 'tailwindcss';
	.truncate {
		display: inline-block;
		max-width: var(--w, 90px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: bottom;
	}
</style>