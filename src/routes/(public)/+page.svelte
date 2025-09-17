<script lang="ts">
  //@ts-nocheck
	import { page } from "$app/state";
  import BGVid from "$lib/assets/main_bg.mp4";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import { ChevronDown, CompassIcon } from "@lucide/svelte";
  export let data;
  let locals = {
    heroTitles: [
      'Where every <b>Trade</b> Counts',
      'Trade <b>Smarter</b>, Win <b>Bigger</b>',
      'Your <b>Gateway</b> to <b>Gains</b>',
      'Every <b>Trade</b> Matters, Every <b>Trader</b> Counts',
      'Trade with <b>Precision</b>, Grow with <b>Confidence</b>',
      'Where Market meets <b>Innovation</b>'
    ],
    FAQs: {
      "How do I start trading on TradeXcope?": "<b>Sign up</b> and begin practicing with our demo account using virtual funds. Once you're comfortable, switch to a live account to trade with real funds.",     
      "How long does it take to withdraw funds?": "Withdrawals typically process within <b>1 to 5 business days</b>, depending on volume and your chosen payment method. We strive to complete withdrawals as quickly as possible.",
      "What is TradeXcope’s trading platform and what does it offer?": "Our trading platform is a web-based application that gives you access to real-time market data, charts, order execution tools, and account analytics—all in a <b>streamlined, user-friendly interface</b>.",
      "Can I trade using a mobile device?": "Yes—you can trade using any modern browser on your smartphone or tablet",
      "What is the minimum deposit amount?": "You can start trading with as little as <b>$10</b>, making it accessible even if you're just getting started.",
      "Are there any deposit or withdrawal fees?": "TradeXcope does <b>not charge fees</b> for deposits or withdrawals. However, third-party payment providers may impose their own fees or currency conversion charges.",
      "What types of assets can I trade on TradeXcope?": "We offer a variety of instruments including <b>forex pairs, commodities, indices, and cryptocurrencies</b>. Availability may vary by account region and type.",
      "Is there a demo account available?": "Yes—TradeXcope provides a free <b>demo account</b> that you can use to practice trading without any financial risk, using virtual funds.",
      "How do I deposit funds into my TradeXcope account?": "Deposits can be made via <b>credit/debit card, bank transfer, or e-wallets</b>. Simply navigate to the 'Deposit' section in your account area and follow the on-screen instructions.",
      "What customer support options are available?": "You can reach our support team through <b>live chat, support ticket or contact form</b>. We're available 24/7 to assist with any questions or concerns.",
      "Is TradeXcope regulated and secure?": "TradeXcope operates under <b>strict regulatory oversight</b>. We use industry-standard encryption and secure servers to protect your data and funds."
    }
  };
  locals.HTi = Math.floor(Math.random() * locals.heroTitles.length);
  $: if (locals.bgvid) {
    locals.bgvid.playbackRate = 0.5;
    locals.bgvid.classList.remove('opacity-0');
    locals.bgvid.classList.add('opacity-10');
  }
  onMount(()=>{
    let tm = setInterval(_=>locals.HTi = (locals.HTi + 1) % locals.heroTitles.length, 5000);

    return ()=>{
      clearInterval(tm);
    }
  })
</script>

<svelte:head>
  <title>{page.data.cached.site_name} - {page.data.cached.site_slogan}</title>
</svelte:head>

<div class="relative w-full h-0 pb-[56.25%] -mb-[56.25%] overflow-hidden -z-[1]">
  <video bind:this={locals.bgvid} class="absolute top-0 left-0 min-w-full min-h-full max-w-full max-h-full opacity-0 transition-opacity duration-1500" muted autoplay loop preload="none">
    <source src="{BGVid}" type="video/mp4"/>
    <track kind="captions">
  </video>
  <div class="absolute top-0 left-0 w-full h-full"></div>
</div>

<div class="home cont">
  <div class="hero text-center py-10 sm:py-15 md:py-20">
    {#each locals.heroTitles as t, i}
      {#if locals.HTi == i}
        <div class="htitle text-3xl sm:text-4xl lg:text-5xl min-h-[2.5em] xl:text-6xl flex items-center justify-center" transition:slide><span>{@html locals.heroTitles[i]}</span></div>
      {/if}
    {/each}
    <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl my-5">Trade forex, stocks, and crypto with confidence — anytime, anywhere.</p>
    <div class="flex items-center justify-center w-full">
      <a class="explr flex items-center justify-center gap-3" href="/auth">
        Explore Now
        <CompassIcon class="size-5 sm:size-6 md:size-7 lg:size-8"/>
      </a>
    </div>
  </div>
  <h2 class="text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-5 sm:mb-10">Why Choose {page.data.cached.site_name}?</h2>
  <div class="flex flex-col ">
  {#each data.features as f}
    <div class="feature flex flex-col md:flex-row gap-10 p-5 pb-10 mb-10 sm:pb-16 sm:mb-16 border-b-2 border-slate-200/20 last:border-b-0">
      <div class="img-cont w-full md:max-w-[33.3333%]">
        <div class="img-div f w-full h-0 pb-[100%] relative">
          <img class="w-full h-full absolute inset-0 rounded-md" loading="lazy" src="{f.img}" alt="{f.title}">
        </div>
      </div>
      <div class="finfo w-full flex flex-col justify-center">
        <div class="flex justify-center md:justify-start">
          <div class="ftitle text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold melting-text-container">
            <h3 class="melting-text" data-text="{f.title}">{f.title}</h3>
          </div>
        </div>
        <div class="fdescription text-justify">{@html f.description}</div>
      </div>
    </div>
  {/each}
  </div>
  <h2 class="text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-10">Frequently Asked Question</h2>
  <div class="faq-list flex flex-col gap-3 md:gap-5 max-w-4xl mx-auto mb-10 md:mb-20">
    {#each Object.entries(locals.FAQs) as [q, a], i}
      <div class="faq bg-slate-100/10 backdrop-blur-[2px] rounded-lg overflow-hidden shadow">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="fq flex items-center justify-between px-4 md:px-6 py-3 cursor-pointer {locals['FAQ'+i] ? 'bg-slate-100/15' : 'hover:bg-slate-100/15'} transition duration-300 ease-out" role="button" on:click={()=>{locals['FAQ'+i] = !locals['FAQ'+i]}} tabindex="-1">
          <span class="text-xl lg:text-2xl">{q}</span>
          <ChevronDown class="transition duration-300 ease-out shrink-0 size-5 md:size-6 {locals['FAQ'+i] ? 'rotate-180' : ''}"/>
        </div>
        {#if locals['FAQ'+i]}
          <div class="fa text-lg lg:text-xl text-justify px-4 md:px-6 py-4" transition:slide={{axis: 'y', duration: 300}}>{@html a}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  @reference 'tailwindcss';
  @property --explr-c1 {
    syntax: "<color>";
    initial-value: theme(--color-emerald-700);
    inherits: false;
  }
  @property --explr-c2 {
    syntax: "<color>";
    initial-value: theme(--color-cyan-700);
    inherits: false;
  }
  @property --explr-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
  video {
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-composite: destination-in;
  }
  .htitle :global(b) { @apply bg-gradient-to-r from-emerald-400 to-cyan-500 text-transparent bg-clip-text; }
  .explr {
    @apply relative font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 py-1.5
            rounded-lg sm:px-5 sm:py-2 md:rounded-xl;
    background-image: linear-gradient(90deg, var(--explr-c1), var(--explr-c2));
    transition: --explr-c1 300ms ease-out, --explr-c2 300ms ease-out;
    &:hover {
      --explr-c1: theme(--color-emerald-500);
      --explr-c2: theme(--color-cyan-500);
    }
    &::after, &::before {
      @apply absolute w-full h-full top-1/2 left-1/2;
      content: "";
      background-image: conic-gradient(from var(--explr-angle), transparent, theme(--color-cyan-500), theme(--color-emerald-500));
      box-sizing: content-box;
      border-radius: inherit;
      transform: translate(-50%, -50%);
      padding: 2px;
      z-index: -1;
      animation: spin 3s linear infinite;
    }
    &::before {
      filter: blur(1.5rem);
      opacity: .5;
    }
  }
  @keyframes spin {
    from {--explr-angle: 0deg}
    to {--explr-angle: 360deg}
  }
  .explr :global(svg) {
    animation: compass 3s linear infinite;
  }
  .explr:hover :global(svg) {
    animation-play-state: paused;
  }
  @keyframes compass {
    50% { rotate: -90deg; }
  }
  .f.img-div {
    -webkit-mask-image: 
        linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
    mask-image: 
        linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-composite: intersect;
    mask-composite: intersect;
  }
  @supports (display: block) {
    .melting-text-container {
      position: relative;
      overflow: hidden;
      padding-bottom: 40px;
    }
    .melting-text {
      position: relative;
      animation: melt 3s infinite ease-in-out;
      background: linear-gradient(90deg, theme(--color-cyan-400), theme(--color-emerald-400));
      -webkit-background-clip: text;
      color: transparent;
    }
    .melting-text::before,
    .melting-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, theme(--color-cyan-400), theme(--color-emerald-400));
        -webkit-background-clip: text;
        color: transparent;
        z-index: -1;
        transform: scaleY(1);
        opacity: 0.5;
        animation: drip 3s infinite ease-in-out;
    }
    .melting-text::after {
        filter: blur(10px);
        opacity: 0.3;
    }
    /* Keyframes for melting effect */
    @keyframes melt {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(20px);
        }
    }

    @keyframes drip {
        0%, 100% {
            transform: scaleY(1);
            opacity: 0.5;
        }
        50% {
            transform: scaleY(1.4);
            opacity: 0.7;
        }
    }

  } 
</style>