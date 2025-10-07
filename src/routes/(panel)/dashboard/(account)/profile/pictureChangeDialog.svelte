<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { ExternalLinkIcon, Camera, Info, CircleCheckBigIcon } from "@lucide/svelte";
	import { ScrollArea } from "$main/src/lib/components/ui/scroll-area";
</script>

<Dialog.Root>
	<Dialog.Trigger class="{buttonVariants({ variant: 'link' })} mx-auto">
		<Camera class="size-4" />
		Want to Change Profile Picture?
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<div class="flex items-center gap-3">
				<div class="p-2 rounded-md bg-primary/10">
					<Camera class="size-5 text-primary" />
				</div>
				<div>
					<Dialog.Title>
						Update Profile Picture
					</Dialog.Title>
					<Dialog.Description class="mt-1">
						Your profile picture is managed through Gravatar for consistent display across platforms
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>
		<ScrollArea class="max-h-[calc(100vh-350px)] sm:max-h-[calc(100vh-250px)]">
			<div class="space-y-3">
				<div class="bg-muted/30 rounded-lg p-4 border border-border/50">
					<div class="flex items-start gap-3">
						<Info class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
						<div class="space-y-2">
							<p class="text-sm font-medium text-card-foreground">
								Gravatar Integration
							</p>
							<p class="text-sm text-muted-foreground">
								Your profile picture is synchronized with Gravatar using your account email address.
								Changes made on Gravatar will automatically reflect here.
							</p>
						</div>
					</div>
				</div>
	
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-card-foreground flex items-center gap-2">
						<CircleCheckBigIcon class="w-5 h-5 text-primary" />
						How to Update
					</h3>
	
					<div class="grid gap-4">
						<div class="flex gap-3">
							<div class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
								1
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-card-foreground">Visit Gravatar</p>
								<p class="text-sm text-muted-foreground">Go to <span class="text-primary font-medium">gravatar.com</span> or use the button below</p>
							</div>
						</div>
	
						<div class="flex gap-3">
							<div class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
								2
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-card-foreground">Sign In</p>
								<p class="text-sm text-muted-foreground">Use the same email address associated with your account</p>
							</div>
						</div>
	
						<div class="flex gap-3">
							<div class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
								3
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-card-foreground">Upload & Select</p>
								<p class="text-sm text-muted-foreground">Upload your new image, crop it, and set as your primary Gravatar</p>
							</div>
						</div>
					</div>
				</div>
	
				<div class="bg-primary/5 rounded-lg p-4 border border-primary/20">
					<div class="flex items-start gap-3">
						<CircleCheckBigIcon class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
						<div class="space-y-1">
							<p class="text-sm font-medium text-card-foreground">Update Timeline</p>
							<p class="text-sm text-muted-foreground">
								Changes typically appear within a few minutes. If you don't see the update immediately,
								try refreshing the page or clearing your browser cache.
							</p>
						</div>
					</div>
				</div>
			</div>
		</ScrollArea>

		<Dialog.Footer class="mt-8 gap-3">
			<Dialog.Close class="{buttonVariants({ variant: 'outline' })}">
				Cancel
			</Dialog.Close>
			<Button href="https://gravatar.com" target="_blank" class="bg-primary hover:bg-primary/90">
				<ExternalLinkIcon class="w-4 h-4 mr-2" />
				Open Gravatar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
