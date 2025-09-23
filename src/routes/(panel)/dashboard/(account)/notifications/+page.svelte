<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { CheckCircle, Circle, Trash2, Archive, Bell, BellOff } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export let data;

  let selectedNotifications = new Set();
  let isSelectionMode = false;

  // Get current page from URL
  $: currentPage = data.pagination.page;
  $: totalPages = data.pagination.totalPages;
  $: notifications = data.notifications;

  // Navigation functions
  function goToPage(pageNum: number) {
    const url = new URL($page.url);
    url.searchParams.set('page', pageNum.toString());
    goto(url.toString());
  }

  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  // Notification actions (these would need API endpoints)
  async function toggleSeen(notification: any) {
    // TODO: Implement API call to toggle notification seen status
    console.log('Toggle seen for notification:', notification.id);
  }

  async function deleteNotification(notification: any) {
    // TODO: Implement API call to delete notification
    console.log('Delete notification:', notification.id);
  }

  async function markAllAsRead() {
    // TODO: Implement API call to mark all notifications as read
    console.log('Mark all as read');
  }

  async function markAllAsUnread() {
    // TODO: Implement API call to mark all notifications as unread
    console.log('Mark all as unread');
  }

  function toggleSelection(notificationId: string) {
    if (selectedNotifications.has(notificationId)) {
      selectedNotifications.delete(notificationId);
    } else {
      selectedNotifications.add(notificationId);
    }
    selectedNotifications = new Set(selectedNotifications);
  }

  async function deleteSelected() {
    // TODO: Implement API call to delete selected notifications
    console.log('Delete selected notifications:', Array.from(selectedNotifications));
    selectedNotifications.clear();
    isSelectionMode = false;
  }

  function selectAll() {
    notifications.forEach(n => selectedNotifications.add(n.id));
    selectedNotifications = new Set(selectedNotifications);
  }

  function clearSelection() {
    selectedNotifications.clear();
    isSelectionMode = false;
  }

  // Format notification type based on content
  function getNotificationType(title: string) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('deposit') || lowerTitle.includes('withdrawal')) return 'financial';
    if (lowerTitle.includes('trade') || lowerTitle.includes('trading')) return 'trading';
    if (lowerTitle.includes('security') || lowerTitle.includes('login')) return 'security';
    if (lowerTitle.includes('system') || lowerTitle.includes('maintenance')) return 'system';
    return 'general';
  }

  // Get notification icon based on type
  function getNotificationIcon(type: string, seen: boolean) {
    if (seen) return CheckCircle;
    switch (type) {
      case 'financial': return Bell;
      case 'trading': return Bell;
      case 'security': return BellOff;
      case 'system': return Archive;
      default: return Circle;
    }
  }
</script>

<svelte:head>
  <title>Notifications - Dashboard</title>
</svelte:head>

<div class="space-y-6 p-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Notifications</h1>
      <p class="text-muted-foreground mt-1">
        Stay updated with your latest activities and system alerts
      </p>
    </div>

    <div class="flex items-center gap-2">
      {#if notifications.length > 0}
        <Button
          variant="outline"
          size="sm"
          onclick={() => isSelectionMode = !isSelectionMode}
          class="hidden sm:flex"
        >
          {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onclick={markAllAsRead}
          disabled={notifications.every(n => n.seen)}
        >
          Mark All Read
        </Button>

        <Button
          variant="outline"
          size="sm"
          onclick={markAllAsUnread}
          disabled={notifications.every(n => !n.seen)}
        >
          Mark All Unread
        </Button>
      {/if}
    </div>
  </div>

  <!-- Stats -->
  {#if notifications.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Bell class="h-4 w-4 text-primary" />
            </div>
            <div>
              <p class="text-sm font-medium">Total</p>
              <p class="text-2xl font-bold">{data.pagination.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-500/10 rounded-lg">
              <Circle class="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p class="text-sm font-medium">Unread</p>
              <p class="text-2xl font-bold">{data.pagination.total - notifications.filter(n => n.seen).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle class="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p class="text-sm font-medium">Read</p>
              <p class="text-2xl font-bold">{notifications.filter(n => n.seen).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  {/if}

  <!-- Selection Mode Actions -->
  {#if isSelectionMode && selectedNotifications.size > 0}
    <Card class="border-primary/20 bg-primary/5">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium">
              {selectedNotifications.size} notification{selectedNotifications.size > 1 ? 's' : ''} selected
            </span>
            <Button variant="outline" size="sm" onclick={selectAll}>
              Select All on Page
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" onclick={clearSelection}>
              Clear
            </Button>
            <Button variant="destructive" size="sm" onclick={deleteSelected}>
              <Trash2 class="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}

  <!-- Notifications List -->
  {#if notifications.length === 0}
    <Card>
      <CardContent class="p-12 text-center">
        <div class="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Bell class="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold mb-2">No notifications yet</h3>
        <p class="text-muted-foreground">
          You'll see your latest activities and system alerts here when they arrive.
        </p>
      </CardContent>
    </Card>
  {:else}
    <div class="space-y-3">
      {#each notifications as notification (notification.id)}
        {@const notificationType = getNotificationType(notification.title)}
        {@const IconComponent = getNotificationIcon(notificationType, notification.seen)}

        <Card class="group hover:shadow-md transition-all duration-200 {notification.seen ? 'opacity-75' : 'border-primary/20 bg-primary/5'}">
          <CardContent class="p-4">
            <div class="flex items-start gap-4">
              <!-- Selection Checkbox -->
              {#if isSelectionMode}
                <div class="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onchange={() => toggleSelection(notification.id)}
                    class="rounded border-input"
                  />
                </div>
              {/if}

              <!-- Icon -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center {notification.seen ? 'bg-muted' : 'bg-primary/10'}">
                  <IconComponent class="h-5 w-5 {notification.seen ? 'text-muted-foreground' : 'text-primary'}" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-semibold text-sm {notification.seen ? 'text-muted-foreground' : ''}">
                        {notification.title}
                      </h3>
                      <Badge variant={notification.seen ? 'secondary' : 'default'} class="text-xs">
                        {notificationType}
                      </Badge>
                    </div>

                    <p class="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{notification.timeAgo}</span>
                      <span>•</span>
                      <span>{notification.seen ? 'Read' : 'Unread'}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => toggleSeen(notification)}
                      class="h-8 w-8 p-0"
                      title={notification.seen ? 'Mark as unread' : 'Mark as read'}
                    >
                      {#if notification.seen}
                        <Circle class="h-4 w-4" />
                      {:else}
                        <CheckCircle class="h-4 w-4" />
                      {/if}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => deleteNotification(notification)}
                      class="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Delete notification"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * data.pagination.limit) + 1}-{Math.min(currentPage * data.pagination.limit, data.pagination.total)} of {data.pagination.total} notifications
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onclick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div class="flex items-center gap-1">
            {#each Array(totalPages) as _, i}
              <Button
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onclick={() => goToPage(i + 1)}
                class="h-8 w-8 p-0"
              >
                {i + 1}
              </Button>
            {/each}
          </div>

          <Button
            variant="outline"
            size="sm"
            onclick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  /* Custom scrollbar for notifications */
  .space-y-3::-webkit-scrollbar {
    width: 6px;
  }

  .space-y-3::-webkit-scrollbar-track {
    background: hsl(var(--muted));
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }

  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }
</style>
