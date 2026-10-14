<script>
	import { onMount } from 'svelte';
	import { SITE_URL } from '#lib/data.js';

	const DESCRIPTION = 'Meeting 1: LED heart breadboard speed build. Breadboard basics, LED polarity and how not to burn your LEDs.';
	const IMG = '/assets/meetings/1';

	let { data } = $props();

	const resistors = [
		['USB', 1, '220Ω', ['red', 'red', 'brown']],
		['9V', 1, '470Ω', ['yellow', 'violet', 'brown']],
		['9V', 2, '330Ω', ['orange', 'orange', 'brown']],
		['9V', 3, '220Ω', ['red', 'red', 'brown']]
	];

	let elapsed = $state(0);
	let running = $state(false);
	let start = 0;
	let frame;

	const time = $derived.by(() => {
		const cs = Math.floor(elapsed / 10);
		const m = Math.floor(cs / 6000);
		const s = Math.floor(cs / 100) % 60;
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
	});

	function tick() {
		elapsed = performance.now() - start;
		frame = requestAnimationFrame(tick);
	}

	function toggle() {
		running = !running;
		if (running) {
			start = performance.now() - elapsed;
			tick();
		} else cancelAnimationFrame(frame);
	}

	function reset() {
		cancelAnimationFrame(frame);
		running = false;
		elapsed = 0;
	}

	function onkeydown(e) {
		if (e.target.closest('button, a')) return;
		if (e.code === 'Space') {
			e.preventDefault();
			toggle();
		} else if (e.key === 'r') reset();
	}

	onMount(() => () => cancelAnimationFrame(frame));
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<title>Meeting 1: LED heart | Fraser Comp Sci Club</title>
	<meta name="description" content={DESCRIPTION}>
	<link rel="canonical" href="{SITE_URL}/meetings/1">
	<meta property="og:title" content="Meeting 1: LED heart | Fraser Comp Sci Club">
	<meta property="og:description" content={DESCRIPTION}>
	<meta property="og:url" content="{SITE_URL}/meetings/1">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
</svelte:head>

<div class="bar" class:running>
	<a class="brand" href="/#meetings"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club" width="36" height="36"><span>Meeting 01</span></a>
	<div class="timer" role="timer" aria-label="Speedrun timer">
		<b>{time}</b>
		<button onclick={toggle}>{running ? 'Pause' : elapsed ? 'Resume' : 'Start'}</button>
		<button onclick={reset} disabled={!elapsed}>Reset</button>
	</div>
</div>

<main>
	<header class="section halftone">
		<div class="wrap">
			<span class="label">Thu Oct 15 · Rm 183</span>
			<h1 class="section-title"><span class="echo" data-echo="LED heart!!">LED heart!!</span></h1>
			<p class="section-lede">Build a heart out of LEDs on a breadboard. Lay it out however you want. <b>Fastest working heart wins a $10 Tims card!</b></p>
		</div>
	</header>

	<div class="guide">
		<section class="row">
			<div class="text">
				<h2>Breadboard</h2>
				<p>A breadboard lets you build circuits without soldering. Push a leg into a hole and a metal clip inside grabs it.</p>
				<p><b>Each line of 5 holes is one metal strip.</b> Anything plugged into the same 5 is connected. The gap down the middle splits them, so the two sides are <b>not</b> connected.</p>
				<p><b>The long lines on the edges are the power rails.</b> The whole line is connected. Your power goes here: <span class="pos">+ on red</span>, <span class="neg">− on blue</span>.</p>
			</div>
			<div class="media two">
				<figure><img src="{IMG}/breadboard_inside.webp" alt="Breadboard with the back removed, showing metal strips"><figcaption>Inside: the metal strips</figcaption></figure>
				<figure><img src="{IMG}/breadboard_map.webp" alt="Map of which breadboard holes are connected"><figcaption>Connected holes</figcaption></figure>
			</div>
		</section>

		<section class="row">
			<div class="text">
				<h2>LEDs</h2>
				<p>LED = light emitting diode. A diode only lets current flow one way, so an LED only lights up if it's the right way around.</p>
				<p><b class="pos">Long leg = + (anode).</b> Goes toward power.</p>
				<p><b class="neg">Short leg = − (cathode).</b> Goes toward −. The rim has a flat edge on this side too, in case the legs got cut.</p>
			</div>
			<div class="media">
				<figure><img class="led" src="{IMG}/led.webp" alt="LED diagram: long leg +, short leg and flat edge −"></figure>
			</div>
		</section>

		<section class="row warn">
			<div class="text">
				<h2>Don't burn your LEDs!!</h2>
				<p>An LED can't limit its own current. Plug it straight into 5V or 9V and it pulls way too much, gets hot and dies, sometimes with a pop.</p>
				<p><b>A resistor in the same path limits the current</b> to a safe amount (about 15 mA). It can go before or after the LED.</p>
				<ul>
					<li><b>Every LED path needs a resistor.</b></li>
					<li><b>Never wire + straight to −.</b> That's a short. Batteries get hot fast and USB ports cut out.</li>
					<li><b>LEDs side by side each get their own resistor.</b> If they share one, one LED hogs the current and burns out.</li>
					<li><b>Unplug power before moving things.</b></li>
				</ul>
			</div>
			<div class="media">
				<figure><img src="{IMG}/example_9v.webp" alt="9V battery to + rail, through a resistor, through an LED, back to the − rail"><figcaption>+ rail → resistor → LED → − rail</figcaption></figure>
			</div>
		</section>

		<section class="row">
			<div class="text">
				<h2>Which resistor?</h2>
				<p>Each red LED uses about 2V. The resistor takes whatever's left over. More LEDs in a row means less left over, so a smaller resistor.</p>
				<div class="picker">
					{#each resistors as [power, n, ohms, bands]}
						<div class="pick">
							<span class="power">{power}</span>
							<span class="leds" aria-label="{n} LED{n > 1 ? 's' : ''} in a row">{#each { length: n } as _}<i></i>{/each}</span>
							<span class="res" title={bands.join(' ')}>{#each bands as b}<i class="band--{b}"></i>{/each}<i class="band--gold"></i></span>
							<b>{ohms}</b>
						</div>
					{/each}
				</div>
				<p class="small">Not sure? 1kΩ (brown black red) is safe for one LED on either, just dimmer.</p>
			</div>
			<div class="media">
				<figure><img src="{IMG}/resistor_code.webp" alt="Resistor color code chart"><figcaption>First two bands = digits, third = number of zeros. Red red brown = 22 + one 0 = 220Ω</figcaption></figure>
			</div>
		</section>

		<section class="row">
			<div class="text">
				<h2>Power</h2>
				<p>Pick either one.</p>
				<p><b>USB (5V):</b> plug the USB board into the breadboard. Wire <span class="pos">VCC to +</span> and <span class="neg">GND to −</span>. 5V is only enough for one LED per resistor.</p>
				<p><b>9V battery:</b> snap on the clip. <span class="pos">Red wire to +</span>, <span class="neg">black to −</span>. 9V is enough for up to 3 LEDs in a row on one resistor, so fewer resistors to place.</p>
			</div>
			<div class="media two">
				<figure><img src="{IMG}/usb_breakout.webp" alt="USB breakout board with VCC and GND pins"><figcaption>USB board</figcaption></figure>
				<figure><img src="{IMG}/battery_snap.webp" alt="9V battery clip with red and black wires"><figcaption>9V clip</figcaption></figure>
			</div>
		</section>

		<section class="row">
			<div class="text">
				<h2>Wiring lots of LEDs</h2>
				<p><b>In a row (series):</b> one LED's short leg goes into the same 5 holes as the next LED's long leg. The same current goes through all of them, so they share one resistor. 9V only.</p>
				<p><b>Side by side (parallel):</b> each LED gets its own path from + to −, with its own resistor. Works on USB or 9V.</p>
				<p>A heart is usually a mix: a few short rows, each with one resistor.</p>
			</div>
			<div class="media two">
				<figure><img src="{IMG}/example_photo.webp" alt="LEDs on a breadboard powered by a 9V battery"><figcaption>LEDs on a 9V</figcaption></figure>
				<figure><img src="/assets/projects/led-heart.webp" alt="Red LEDs arranged in a heart"><figcaption>Inspiration</figcaption></figure>
			</div>
		</section>

		{#if data.builds.length}
			<section class="builds">
				<h2>Everyone's hearts!!</h2>
				<div class="build-grid">
					{#each data.builds as p (p.id)}
						<figure><img src={p.src} alt={p.name} loading="lazy"><figcaption>{p.name}<small>by {p.by}</small></figcaption></figure>
					{/each}
				</div>
			</section>
		{/if}

		<a class="btn back" href="/#meetings">← All meetings</a>
	</div>
</main>

<style>
	.bar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px var(--gutter); background: var(--ink); box-shadow: 0 4px 0 var(--red-dark); }
	.bar.running { box-shadow: 0 4px 0 var(--cyan-deep); }
	.bar .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 800; text-transform: uppercase; }
	.bar .brand img { width: 36px; }
	.timer { display: flex; align-items: center; gap: 8px; }
	.timer b { font-family: var(--mono); font-size: clamp(24px, 2.6vw, 36px); line-height: 1; font-variant-numeric: tabular-nums; margin-right: 6px; }
	.running .timer b { color: var(--cyan); }
	.timer button { font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 14px; padding: 8px 12px 5px; border-radius: 5px; border: 2px solid var(--white); background: transparent; color: var(--white); cursor: pointer; }
	.timer button:first-of-type { background: var(--white); color: var(--ink); }
	.timer button:disabled { opacity: .4; cursor: default; }

	header { background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); padding: clamp(40px, 6vw, 72px) 0; }
	header .label { display: block; margin-bottom: 10px; font-size: 14px; }
	.section-lede b { background: var(--red-dark); padding: 0 5px; }

	.guide { background: var(--cream); color: var(--ink); padding: clamp(40px, 5vw, 64px) var(--gutter) 80px; }
	.row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; padding: clamp(28px, 4vw, 48px) 0; }
	.row + .row { border-top: 2px solid #e5d6d9; }
	h2 { font-size: clamp(34px, 4vw, 52px); color: var(--red); margin-bottom: 18px; }
	.text p, .text li { font-size: 18px; line-height: 1.45; color: #4a3a3e; }
	.text p + p, .text ul, .picker + p { margin-top: 12px; }
	.text b { color: var(--ink); }
	.text ul { margin-bottom: 0; padding-left: 20px; display: grid; gap: 8px; }
	.pos { color: var(--red-deep) !important; font-weight: 800; }
	.neg { color: #2b5fc4 !important; font-weight: 800; }
	.small { font-size: 16px !important; }
	.warn { background: var(--white); border-radius: var(--radius); padding-inline: clamp(20px, 3vw, 40px); border: 3px solid var(--red) !important; margin: 20px auto; }
	.warn + .row { border-top: none; }

	.media { display: grid; gap: 14px; justify-items: center; }
	.media.two { grid-template-columns: 1fr 1fr; align-items: start; }
	figure { margin: 0; display: grid; gap: 8px; justify-items: center; text-align: center; }
	figure img { width: 100%; max-height: 380px; object-fit: contain; border-radius: 8px; background: var(--white); }
	img.led { max-height: 420px; width: auto; background: none; }
	figcaption { font-size: 15px; font-weight: 700; color: #5d4449; }

	.picker { display: grid; gap: 8px; margin-top: 16px; }
	.pick { display: grid; grid-template-columns: 56px 100px 1fr auto; align-items: center; gap: 12px; background: var(--white); border: 2px solid #e5d6d9; border-radius: 8px; padding: 8px 16px; }
	.power { font-size: 20px; font-weight: 800; }
	.leds { display: flex; gap: 5px; }
	.leds i { width: 22px; height: 22px; border-radius: 50%; background: var(--red); box-shadow: inset -3px -3px 0 #c81e2e; }
	.res { display: flex; gap: 5px; align-items: center; justify-content: center; width: 96px; height: 24px; border-radius: 10px; background: #e6c595; padding: 0 12px; }
	.res i { width: 8px; height: 100%; }
	.res i:last-child { margin-left: 6px; }
	.pick b { font-size: 26px; color: var(--red-deep); }
	.band--red { background: #d62a2a; }
	.band--brown { background: #7a4a21; }
	.band--yellow { background: #f2c230; }
	.band--violet { background: #8a4fd1; }
	.band--orange { background: #f08a24; }
	.band--gold { background: #c9a227; }

	.builds { max-width: 1200px; margin: 0 auto; padding: clamp(28px, 4vw, 48px) 0; border-top: 2px solid #e5d6d9; }
	.build-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
	.build-grid figure { background: var(--white); border-radius: var(--radius); padding: 10px; justify-items: stretch; text-align: left; }
	.build-grid img { aspect-ratio: 4 / 3; object-fit: cover; max-height: none; }
	.build-grid figcaption { font-size: 18px; font-weight: 800; text-transform: uppercase; color: var(--ink); }
	.build-grid small { display: block; font-family: var(--mono); font-size: 13px; font-weight: 400; text-transform: none; color: #5d4449; }
	.back { display: flex; width: max-content; margin: 32px auto 0; border-color: var(--red); background: var(--red); color: var(--white); }

	@media (max-width: 820px) {
		.row { grid-template-columns: 1fr; }
		.bar .brand span { display: none; }
	}
	@media (max-width: 520px) {
		.pick { grid-template-columns: 48px 1fr auto; }
		.res { display: none; }
		.timer button { padding: 7px 9px 4px; font-size: 12px; }
	}
</style>
