<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>About us - {page.data.cached.site_name}</title>
</svelte:head>

<div class="about cont prose prose-invert sm:prose-lg md:prose-xl lg:prose-2xl my-10">
  <section>
      <h1>About Us</h1>
      <h2>Welcome to {page.data.cached.site_name}</h2>
      <p>
          {page.data.cached.site_name} was founded with a simple mission: to make trading smarter, simpler, and more accessible for everyone. 
          In an industry that has often been seen as complex and closed-off, we aim to create a transparent and user-friendly platform 
          where both beginners and professionals can thrive. 
      </p>
  </section>

  <section>
      <h2>Our Story</h2>
      <p>
          Our journey began when a group of traders, developers, and financial experts came together with a shared frustration: 
          existing platforms were either too complicated for beginners or too limited for advanced users. 
          We believed there had to be a better way—a platform that combines powerful tools with simplicity and reliability. 
      </p>
      <p>
          With years of experience in financial markets and technology, we built {page.data.cached.site_name} from the ground up. 
          Every feature was designed with one goal in mind: to give you the freedom to trade with confidence. 
      </p>
  </section>

  <section>
      <h2>Our Vision</h2>
      <p>
          We believe financial opportunities should not be reserved for a privileged few. 
          At {page.data.cached.site_name}, we envision a world where anyone, regardless of background, can participate in the global markets. 
          By providing intuitive tools, education, and real-time insights, we are empowering traders to take control of their financial future. 
      </p>
  </section>

  <section>
      <h2>What We Offer</h2>
      <ul>
          <li>Access to a wide range of assets including stocks, currencies, commodities, and cryptocurrencies.</li>
          <li>Real-time data and fast execution, ensuring that you never miss an opportunity.</li>
          <li>Risk-free demo accounts so you can practice and build confidence before trading with real funds.</li>
          <li>Educational resources for beginners and advanced traders alike.</li>
          <li>Dedicated customer support available whenever you need assistance.</li>
      </ul>
  </section>

  <section>
      <h2>How It Works</h2>
      <ol>
          <li>Choose the asset you want to trade.</li>
          <li>Set your trade size and time frame.</li>
          <li>Use our charts and analysis tools to make informed predictions.</li>
          <li>Execute your trade and track results instantly.</li>
      </ol>
      <p>
          It’s that simple. Whether you’re taking your first steps in trading or refining a seasoned strategy, 
          {page.data.cached.site_name} makes the process seamless and efficient. 
      </p>
  </section>

  <section>
      <h2>Why Choose {page.data.cached.site_name}?</h2>
      <p>
          Unlike traditional platforms that overwhelm users with complexity, {page.data.cached.site_name} focuses on clarity and efficiency. 
          We provide everything you need to make smart decisions—without the noise. 
      </p>
      <p>
          Our commitment to innovation ensures that the platform evolves alongside the markets. 
          From powerful analysis tools to mobile-ready trading, we’re always building for the future. 
      </p>
  </section>

  <section>
      <h2>Our Commitment</h2>
      <p>
          Transparency, integrity, and trust are the foundations of {page.data.cached.site_name}. 
          We are committed to creating a safe and fair environment where every trader has equal access to opportunities. 
          Your success is our success, and we’re here to support you at every stage of your journey. 
      </p>
  </section>

  <section>
      <h2>Start Your Journey</h2>
      <p>
          Whether you’re here to learn, practice, or trade professionally, {page.data.cached.site_name} provides the tools and environment 
          to help you succeed. Get started with a demo account today, or open a real account to begin trading instantly. 
      </p>
      <p><strong>{page.data.cached.site_name} — {page.data.cached.site_slogan}</strong></p>
  </section>
</div>
