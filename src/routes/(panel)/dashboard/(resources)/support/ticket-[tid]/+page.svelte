<script>
	import { navigating } from '$app/stores';
	import { MessageCircleReplyIcon, TicketIcon, TicketMinusIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';
  import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { enhanceWithLoader } from '$main/src/lib/publicFunc.js';
	import RichTextEditor from '$main/src/lib/comps/richTextEditor.svelte';
	import { Button } from '$main/src/lib/components/ui/button/index.js';

  export let data;
  export let form;
  
  let blockAnimation = $navigating == null;

  $: if (form?.msg) {
		(form?.success ? toast.success : toast.error)(form?.msg)
	}

  onMount(()=>{
		blockAnimation = false;
	})
</script>
<svelte:head>
  <title>Ticket: {data.ticket.subject} - {data.cached.site_name}</title>
</svelte:head>


<div class="p-3 md:p-4 lg:p-5 tikpage">
  <div class="flex items-center justify-between mb-10">
		<div class="flex items-center gap-3">
			<div class="bg-zinc-100 text-zinc-800 p-2 rounded-lg">
				<TicketIcon/>
			</div>
			<div class="flex items-center gap-3">
				<h1 class="font-bold text-2xl">Ticket: {data.ticket.subject}</h1>
        <span class="leading-none px-2 py-1 rounded-md border
          {
          data.ticket.status == 'OPEN' ? 'text-blue-500 bg-blue-800/20 border-blue-800' :
          data.ticket.status == 'ANSWERED' ? 'text-emerald-500 bg-emerald-800/20 border-emerald-800' :
          data.ticket.status == 'REPLIED' ? 'text-amber-500 bg-amber-800/20 border-amber-800' :
          data.ticket.status == 'CLOSED' ? 'text-red-600 bg-red-800/20 border-red-800' :
          'text-purple-500 bg-purple-800/20 border-purple-800'
          }">{data.ticket.status}</span>
			</div>
		</div>
	</div>
  <div class="flex flex-col gap-4 mb-5">
    {#each data.ticket.messages as m, i (m.id)}
      <div class="message-wrapper" in:fly|global={ blockAnimation ? { delay: 0, duration: 0, opacity: 1 } : { x: ((-1)**i) * 100 + '%', duration: 300, delay: i*100 }}>
        <Card.Root class="border-l-2 {m.from === 'USER' ? 'border-l-blue-500/50' : 'border-l-emerald-500/50'}">
          <Card.Header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {m.from === 'USER' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}">
                  {m.from === 'USER' ? 'You' : 'Team'}
                </div>
                <div>
                  <Card.Title class="text-base text-zinc-200">
                    {m.from === 'USER' ? 'You' : 'Support Team'}
                  </Card.Title>
                  <Card.Description class="text-sm text-zinc-400">
                    {m.createdAt.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '')}
                  </Card.Description>
                </div>
              </div>
              <Badge class="text-xs {m.from === 'USER' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}">
                {m.from === 'USER' ? 'Reply' : 'Answer'}
              </Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <div class="prose prose-zinc prose-invert lg:prose-lg max-w-none">
              {@html m.html}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    {/each}
  </div>
  <div class="mb-3 mt-10">
    <h3 class="text-xl mb-5 text-center">{ data.ticket.status == 'CLOSED' ? 'Want to re-open this ticket?' : 'Want to reply?' }</h3>
    <form action="?/create" method="post" use:enhanceWithLoader>
      {#key form?.clearForm}
        <RichTextEditor name="message"/>
      {/key}
      <div class="pt-5 grid sm:flex items-center sm:justify-center gap-3">
        <Button type="submit">
          <MessageCircleReplyIcon/>
          <span>Submit Reply</span>
        </Button>
        {#if data.ticket.status != 'CLOSED'}
        <Button variant="secondary" type="submit" formaction="?/close">
          <TicketMinusIcon/>
          <span>Close Ticket</span>
        </Button>
        {/if}
      </div>
    </form>
  </div>
</div>
