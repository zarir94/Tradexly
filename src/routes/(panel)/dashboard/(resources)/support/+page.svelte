<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, TrendingUp } from '@lucide/svelte';

  export let data;

  // Mock data for demonstration - in real app this would come from server
  let tickets = [
    {
      id: '1',
      subject: 'Unable to withdraw funds',
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: '2024-01-15T10:30:00Z',
      lastMessage: 'I am still waiting for a response on my withdrawal issue...',
      messages: 3
    },
    {
      id: '2',
      subject: 'Account verification issue',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: '2024-01-14T14:20:00Z',
      lastMessage: 'Please provide additional documentation for verification.',
      messages: 5
    },
    {
      id: '3',
      subject: 'Trading platform question',
      status: 'RESOLVED',
      priority: 'LOW',
      createdAt: '2024-01-13T09:15:00Z',
      lastMessage: 'Thank you for your help! The issue has been resolved.',
      messages: 2
    }
  ];

  let stats = {
    open: 12,
    inProgress: 8,
    resolved: 45,
    closed: 23,
    total: 88
  };

  function getStatusColor(status: string) {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'IN_PROGRESS': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'RESOLVED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'CLOSED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'LOW': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Support Center - {data.cached.site_name}</title>
</svelte:head>

<div class="space-y-6 p-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Support Center</h1>
      <p class="text-muted-foreground">Get help and manage your support tickets</p>
    </div>
    <Button class="gap-2" href="/dashboard/support/new">
      <Plus class="h-4 w-4" />
      New Ticket
    </Button>
  </div>

  <!-- Stats Cards -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Open Tickets</CardTitle>
        <AlertCircle class="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.open}</div>
        <p class="text-xs text-muted-foreground">
          Awaiting response
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">In Progress</CardTitle>
        <Clock class="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.inProgress}</div>
        <p class="text-xs text-muted-foreground">
          Being worked on
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Resolved</CardTitle>
        <CheckCircle class="h-4 w-4 text-green-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.resolved}</div>
        <p class="text-xs text-muted-foreground">
          Successfully resolved
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Tickets</CardTitle>
        <TrendingUp class="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.total}</div>
        <p class="text-xs text-muted-foreground">
          All time tickets
        </p>
      </CardContent>
    </Card>
  </div>

  <!-- Tickets List -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <MessageCircle class="h-5 w-5" />
        Your Support Tickets
      </CardTitle>
      <CardDescription>
        View and manage all your support requests
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        {#each tickets as ticket (ticket.id)}
          <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div class="flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-medium">{ticket.subject}</h3>
                <Badge class={getStatusColor(ticket.status)} variant="outline">
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge class={getPriorityColor(ticket.priority)} variant="outline">
                  {ticket.priority}
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-1">
                {ticket.lastMessage}
              </p>
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{ticket.messages} messages</span>
                <span>•</span>
                <span>Created {formatDate(ticket.createdAt)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>

<style>
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
</style>
