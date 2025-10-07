<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Badge } from "$lib/components/ui/badge";

  // Demo session data
  const sessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      ip: "192.168.1.100",
      location: "New York, US",
      loginTime: "2024-01-15 10:30:45",
      isCurrent: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      ip: "203.0.113.45",
      location: "California, US",
      loginTime: "2024-01-14 18:22:12",
      isCurrent: false
    },
    {
      id: 3,
      device: "Firefox on Linux",
      ip: "198.51.100.78",
      location: "London, UK",
      loginTime: "2024-01-13 09:15:33",
      isCurrent: false
    },
    {
      id: 4,
      device: "Edge on Windows",
      ip: "203.0.113.12",
      location: "Toronto, CA",
      loginTime: "2024-01-12 14:45:20",
      isCurrent: false
    }
  ];

  // Form bindings
  let currentPassword = $state("");
  let newPassword = $state("");
  let confirmPassword = $state("");

  function handlePasswordChange() {
    // Password change logic will be implemented by user
    console.log("Password change requested");
  }

  function terminateSession(sessionId: number) {
    // Session termination logic will be implemented by user
    console.log("Terminate session:", sessionId);
  }
</script>

<svelte:head>
  <title>Security Settings - Tradexly</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
  <!-- Password Change Section -->
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-xl font-semibold">Change Password</CardTitle>
      <CardDescription>
        Update your account password to keep your account secure
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="Enter current password"
            bind:value={currentPassword}
          />
        </div>
        <div class="space-y-2">
          <Label for="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            bind:value={newPassword}
          />
        </div>
      </div>
      <div class="space-y-2">
        <Label for="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm new password"
          bind:value={confirmPassword}
        />
      </div>
      <div class="flex gap-2 pt-4">
        <Button onclick={handlePasswordChange} class="bg-primary hover:bg-primary/90">
          Change Password
        </Button>
        <Button variant="outline" onclick={() => { currentPassword = ''; newPassword = ''; confirmPassword = ''; }}>
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Session Management Section -->
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-xl font-semibold">Active Sessions</CardTitle>
      <CardDescription>
        Manage your active sessions across different devices and locations
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- Session List -->
        <div class="space-y-3">
          {#each sessions as session (session.id)}
            <div class="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div class="flex-1 space-y-2 md:space-y-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm">{session.device}</span>
                  {#if session.isCurrent}
                    <Badge variant="default" class="text-xs">Current Session</Badge>
                  {/if}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span class="font-medium">IP:</span> {session.ip}
                  </div>
                  <div>
                    <span class="font-medium">Location:</span> {session.location}
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">
                  <span class="font-medium">Login Time:</span> {session.loginTime}
                </div>
              </div>
              <div class="flex gap-2 mt-3 md:mt-0">
                {#if !session.isCurrent}
                  <Button
                    variant="destructive"
                    size="sm"
                    onclick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                {:else}
                  <Button variant="outline" size="sm" disabled>
                    Current
                  </Button>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- Summary -->
        <div class="pt-4 border-t">
          <div class="flex flex-col md:flex-row md:items-center justify-between text-sm text-muted-foreground">
            <span>Showing {sessions.length} active session{sessions.length !== 1 ? 's' : ''}</span>
            <span class="mt-2 md:mt-0">
              Last activity: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

<style>
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  }
</style>
