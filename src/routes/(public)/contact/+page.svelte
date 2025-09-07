<script>
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
</script>

<svelte:head>
  <title>Contact - {page.data.cached.site_name}</title>
</svelte:head>

<div class="contact cont my-10">
  <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-center">Contact Us</h2>
  <form method="POST" use:enhance>
    <input type="text" name="name" id="name" placeholder="Full Name" required>
    <input type="email" name="email" id="email" placeholder="Email Address" required>
    <input type="text" name="subject" id="subject" placeholder="Subject" required>
    <textarea name="message" id="message" placeholder="Message" rows="7" required></textarea>
    <button>Send</button>
  </form>
</div>

<style lang="postcss">
  @reference 'tailwindcss';
  form { @apply max-w-xl mx-auto flex flex-col gap-5 px-3; }
  input, textarea { @apply bg-slate-200/10 hover:bg-slate-200/15 focus:bg-slate-200/20
    outline-1 outline-slate-200/30 focus:outline-offset-2 focus:outline-2 focus:outline-emerald-400/50
    placeholder:text-slate-100/70
    rounded-lg px-4 py-2 md:px-5 md:py-3 md:text-lg backdrop-blur-[2px] shadow transition-all duration-150 ease-out; }
  form button { @apply bg-gradient-to-tr from-emerald-600 to-cyan-600 max-w-min mx-auto px-5 py-2 rounded-lg md:text-lg cursor-pointer
    transition ease-out duration-300 hover:brightness-125 active:scale-75 focus:outline-2 outline-offset-2 outline-emerald-600; }
</style>
