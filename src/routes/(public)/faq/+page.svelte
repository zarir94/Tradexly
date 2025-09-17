<script>
  //@ts-nocheck
	import { page } from "$app/state";
	import { ChevronDown } from "@lucide/svelte";
	import { slide } from "svelte/transition";
  let locals = {
    FAQ: {
      "General Questions": {
        "What are digital options?": "<b>Digital options</b> are derivative instruments that allow traders to profit from the movement of asset prices (stocks, currencies, indices, commodities, etc.). Since the price and expiration are fixed in advance, both <b>profit and potential loss</b> are known before placing the trade.",
        "What is the expiration period of a trade?": "The <b>expiration period</b> is the time after which a trade automatically closes. With TradeXcope, you can set it from <b>1 minute to 1 month</b>, depending on your trading style.",
        "What are the possible outcomes of a trade?": "There are three outcomes: <b>profit</b> if your prediction is correct, <b>loss</b> limited to your invested amount if your forecast is wrong, and <b>breakeven</b> if the price remains the same at expiration.",
        "Do I need trading experience to start?": "No. TradeXcope offers a <b>demo account</b> where you can practice with virtual funds. This allows you to test strategies and understand the platform before risking real money.",
        "Can I trade on mobile devices?": "Yes. TradeXcope is fully <b>web-based</b> and optimized for smartphones and tablets. You can also install our official <b>mobile app</b> for iOS and Android.",
        "What is a trading platform and why is it needed?": "A <b>trading platform</b> is the software environment where you open, manage, and close trades. It provides <b>real-time quotes, charts, and indicators</b> to help you analyze the market.",
        "What assets can I trade on TradeXcope?": "TradeXcope offers <b>multiple asset classes</b>: currency pairs, company stocks, indices, commodities like oil & gold, and even popular cryptocurrencies like Bitcoin and Ethereum.",
        "Can I close my account? How?": "Yes. You can close your TradeXcope account anytime by going to <b>Profile Settings</b> and selecting <b>Delete Account</b>. Your funds must be withdrawn before closure."
      },
      "Financial Questions": {
        "What determines profit size?": "Profit depends on <b>asset liquidity</b>, <b>time of trade</b>, <b>market conditions</b>, and <b>payout percentage</b> set by the platform. High-demand assets usually provide higher payouts.",
        "How is profit calculated on trades?": "Profits are <b>fixed percentages</b> based on your invested amount, regardless of how much the price changes. For example, a $100 trade with a 90% payout will return $190 if correct.",
        "What is the minimum deposit?": "You can start trading with as little as <b>$10</b>. This low entry makes it easier for beginners to get started without large risks.",
        "What is the minimum withdrawal amount?": "The minimum withdrawal is <b>$10</b> for most payment methods. For cryptocurrencies, the minimum may be higher (e.g., <b>$50 for Bitcoin</b>).",
        "How long does it take to withdraw funds?": "Withdrawals are processed within <b>1–5 business days</b>, depending on the payment provider. Many withdrawals are completed on the <b>same day</b>.",
        "Are there fees for deposits or withdrawals?": "TradeXcope charges <b>no internal fees</b>. However, your bank or payment provider may apply their own <b>transaction or conversion fees</b>.",
        "How do I deposit funds?": "Log into your account, click <b>Deposit</b>, choose your <b>payment method</b> (Visa, Mastercard, e-wallets, or crypto), enter the amount, and confirm.",
        "Do I need to keep depositing regularly?": "No. You only need to deposit when you want to open new trades. You can also practice on a <b>demo account</b> without deposits.",
        "How to withdraw funds?": "Go to your <b>Personal Account</b>, click <b>Withdraw</b>, choose the same method used for deposit, enter the amount, and confirm the request."
      },
      "Account and Verification": {
        "What information is needed for registration?": "To register, you must provide your <b>name, email, phone number</b>, and create a secure password. It only takes a minute.",
        "Can I register with fake information?": "No. You must use <b>real personal data</b>. If your information does not match your documents, your account may be <b>blocked</b> during verification.",
        "What is account verification?": "Verification confirms your <b>identity</b> and <b>residence</b>. TradeXcope may request a passport or ID copy, a selfie, or proof of address for security purposes.",
        "How long does verification take?": "Verification usually takes <b>up to 5 business days</b> after submitting documents.",
        "How do I know my account is verified?": "You will receive a <b>confirmation email or SMS</b> once your verification is successful.",
        "Can I change my account currency?": "Yes. By default, accounts are in <b>USD</b>, but you can change currency in your profile settings. Available options include <b>EUR, GBP, and cryptocurrencies</b>.",
        "Can I have more than one account?": "Each user can have one verified account. However, inside TradeXcope you get <b>two balances</b>: a <b>Live Account</b> and a <b>Demo Account</b>."
      },
      "Trading Platform": {
        "What tools are available for analysis?": "TradeXcope provides <b>advanced charting tools</b>, technical indicators, drawing features, and <b>real-time market data</b> for informed decision-making.",
        "Can I use a demo account?": "Yes. Every user gets a <b>demo account</b> with virtual funds to practice trading risk-free.",
        "What trading strategies can I use?": "You can use <b>trend trading, reversal strategies, news trading</b>, or your own custom strategy. The demo account is perfect for testing these.",
        "Does TradeXcope support cryptocurrencies?": "Yes. You can trade <b>Bitcoin, Ethereum, Litecoin</b>, and other popular cryptocurrencies alongside traditional assets.",
        "Is one-click trading available?": "Yes. TradeXcope supports <b>one-click trading</b> for fast order execution without multiple confirmations."
      },
      "Security and Support": {
        "Are my funds safe?": "Yes. All transactions are <b>encrypted</b> using the latest security protocols. TradeXcope also keeps client funds in <b>segregated accounts</b>.",
        "How do I reset my password?": "Click <b>Forgot Password</b> on the login page, enter your email, and follow the instructions to create a new one.",
        "Can I contact support?": "Yes. Our <b>24/7 support team</b> is available via live chat, email, and phone.",
        "What languages does support cover?": "TradeXcope provides multilingual support in <b>English, Spanish, Russian, Hindi, Arabic, and more</b>."
      }
    }
  }
</script>

<svelte:head>
  <title>FAQ - {page.data.cached.site_name}</title>
</svelte:head>

<div class="faq cont my-10">
  <h2 class="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-5">Frequently Asked Question</h2>
  <div class="faq-list flex flex-col gap-3 md:gap-5 max-w-5xl mx-auto mb-10 md:mb-20">
  {#each Object.entries(locals.FAQ) as [cat, qa], i}
    <h2 class="text-center text-2xl md:text-3xl lg:text-4xl mb-5">{cat}</h2>
    {#each Object.entries(qa) as [q, a], j}
      <div class="faq bg-slate-100/10 backdrop-blur-[2px] rounded-lg overflow-hidden shadow">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="fq flex items-center justify-between px-4 md:px-6 py-3 cursor-pointer {locals[`FAQ_${i}_${j}`] ? 'bg-slate-100/15' : 'hover:bg-slate-100/15'} transition duration-300 ease-out" role="button" on:click={()=>{locals[`FAQ_${i}_${j}`] = !locals[`FAQ_${i}_${j}`]}} tabindex="-1">
          <span class="text-xl lg:text-2xl">{q}</span>
          <ChevronDown class="transition duration-300 ease-out shrink-0 size-5 md:size-6 {locals[`FAQ_${i}_${j}`] ? 'rotate-180' : ''}"/>
        </div>
        {#if locals[`FAQ_${i}_${j}`]}
        <div class="fa text-lg lg:text-xl text-justify px-4 md:px-6 py-4" transition:slide={{axis: 'y', duration: 300}}>{@html a}</div>
        {/if}
      </div>
    {/each}
  {/each}
</div>
</div>

