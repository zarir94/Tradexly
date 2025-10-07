<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';

  export let value: string;
  export let name: string;

	let countries: { name: string, svg: string }[] = [];
  $: svg = countries.find(i=>i.name == value)?.svg;
	let open = false;
  let defWidth = 250;
	let triggerRef: HTMLButtonElement | null = null;
  $: if (triggerRef && triggerRef.offsetWidth && open) {
    defWidth = triggerRef.offsetWidth;
  }
  let emptyText = 'No Country Found';

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}
	onMount(async () => {
    let bcT = emptyText + '';
    emptyText = 'Loading Countries...';
		let r = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
		if (!r.ok) {
      emptyText = 'Cannot Fetch Countries, refresh the page or try again later.';
      return toast.error('Cannot Fetch Countries, refresh the page or try again later.', { duration: 10000 })
    }
    let d = await r.json();
    countries = d.map((i: any)=>({name: i.name.common, svg: i.flags.svg})).sort((a: any, b: any) => a.name.localeCompare(b.name));
    emptyText = bcT;
	});
</script>

<input type="hidden" {name} {value}>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="justify-between" role="combobox" aria-expanded={open}>
        <div class="flex items-center gap-2">
          <img class="text-transparent w-4" src="{svg}" alt="{value}" class:hidden={!svg}>
          <span>{value || 'Select a Country...'}</span>
        </div>
				<ChevronsUpDownIcon class="opacity-70" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="start" class="p-0">
		<Command.Root style="width: {defWidth}px">
			<Command.Input placeholder="Search Country..." />
			<Command.List>
				<Command.Empty>{emptyText}</Command.Empty>
				<Command.Group value="countries">
					{#each countries as c (c.name)}
						<Command.Item
							value={c.name}
							onSelect={() => {
								value = c.name;
								closeAndFocusTrigger();
							}}
						>
            <div class="flex justify-between w-full items-center">
              <div class="flex gap-2 items-center">
                <img class="text-transparent w-5" src="{c.svg}" alt="{c.name}">
                <span>{c.name}</span>
              </div>
              <CheckIcon class={value == c.name ? '' : 'text-transparent'} />
            </div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

<style lang="postcss">
  @reference 'tailwindcss';
</style>
