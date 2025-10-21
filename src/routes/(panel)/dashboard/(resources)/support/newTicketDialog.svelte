<script>
	import { Button, buttonVariants } from "$main/src/lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
	import { CirclePlusIcon, TicketIcon } from "@lucide/svelte";
	import { enhanceWithLoader } from "$main/src/lib/publicFunc";
	import { Label } from "$main/src/lib/components/ui/label";
	import { Input } from "$main/src/lib/components/ui/input";
	import RichTextEditor from "$main/src/lib/comps/richTextEditor.svelte";
</script>

<Dialog.Root>
  <Dialog.Trigger class="{buttonVariants({ variant: 'default' })}" type="button">
    <CirclePlusIcon/>
    <span class="sm:hidden">New</span>
    <span class="hidden sm:inline">Create New Ticket</span>
  </Dialog.Trigger>
  <Dialog.Content class="w-[calc(100vw-2rem)] !max-w-5xl">
    <form class="grid w-full gap-4" action="?/create" method="post" use:enhanceWithLoader>
      <Dialog.Header>
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-md bg-primary/10">
            <TicketIcon class="size-5 text-primary" />
          </div>
          <div class="text-left">
            <Dialog.Title>
              Create New Ticket
            </Dialog.Title>
            <Dialog.Description class="mt-1">
              Create a new support ticket about your issue to get assistance from our support team.
            </Dialog.Description>
          </div>
        </div>
      </Dialog.Header>
      <div class="max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-300px+50px)] overflow-auto px-2.5">
        <div class="space-y-5">
          <div class="space-y-2">
            <Label for="subject">Subject</Label>
            <Input type="text" id="subject" name="subject" placeholder="Briefly describe your issue" required/>
          </div>
          <div class="space-y-2">
            <Label>Message</Label>
            <RichTextEditor editorHeightClass="h-[calc(100vh-450px)] sm:h-[calc(100vh-450px+50px)]" name="message"/>
          </div>
        </div>
      </div>
      <Dialog.Footer class="mt-3 gap-3">
        <Dialog.Close class="{buttonVariants({ variant: 'outline' })}">
          Cancel
        </Dialog.Close>
        <Button type="submit">
          <span>Create</span>
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

