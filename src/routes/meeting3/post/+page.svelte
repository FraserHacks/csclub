<script>
	import { INSTAGRAM } from '#lib/data.js';

	const IMG = '/assets/meetings/3';
	const parts = [
		['led', 'LEDs'],
		['button', 'Buttons'],
		['potentiometer', 'Knobs'],
		['servo', 'Servos']
	];

	let w = $state(1080);
	let h = $state(1080);
	const scale = $derived(Math.min(1, w / 1080, h / 1080));
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<svelte:head>
	<title>Meeting 3 post | Fraser Comp Sci Club</title>
	<meta name="robots" content="noindex">
</svelte:head>

<div class="stage">
	<div class="frame" style="width: {1080 * scale}px; height: {1080 * scale}px">
		<article class="post halftone" style="transform: scale({scale})">
			<div class="top">
				<span class="brand"><img src="/assets/logo_small.webp" alt="" width="56" height="56">Meeting 03</span>
				<span class="open">Open meeting · No sign up needed</span>
			</div>

			<h1><span class="echo" data-echo="Arduino!!">Arduino!!</span></h1>
			<p class="when"><span>Thu Oct 29</span><span>11:05 AM</span><span>Rm 183</span></p>
			<div class="pitch">
				<p class="lede">Make lights blink and motors spin with code.</p>
				<ul class="parts">
					{#each parts as [src, label]}<li><img src="{IMG}/{src}_cutout.webp" alt="">{label}</li>{/each}
				</ul>
			</div>

			<img class="uno" src="{IMG}/uno_cutout.webp" alt="Arduino Uno">

			<div class="bottom">
				<span>cs.fraserhacks.dev/meeting3</span>
				<span>@{INSTAGRAM}</span>
			</div>
		</article>
	</div>
</div>

<style>
	.stage { min-height: 100vh; display: grid; place-items: center; background: var(--ink); }
	.frame { overflow: hidden; }
	.post { position: relative; width: 1080px; height: 1080px; transform-origin: top left; overflow: hidden; padding: 64px 72px; background: linear-gradient(140deg, var(--teal) 0%, var(--teal-dark) 100%); color: var(--white); }

	.top { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-weight: 700; font-size: 26px; text-transform: uppercase; }
	.brand { display: flex; align-items: center; gap: 14px; }
	.brand img { width: 56px; }
	.open { background: var(--white); color: var(--ink); padding: 10px 18px 8px; border-radius: 999px; font-size: 22px; }
	
	h1 { margin-top: 40px; font-size: 176px; }
	.when { display: inline-flex; margin-top: 24px; background: var(--white); color: var(--ink); border-radius: 12px; box-shadow: 8px 8px 0 var(--ink); font-size: 46px; font-weight: 800; text-transform: uppercase; line-height: 1; }
	.when span { padding: 18px 26px 12px; }
	.when span + span { border-left: 4px solid var(--teal-dark); }
	.when span:first-child { background: var(--red); color: var(--white); border-radius: 12px 0 0 12px; }
	.echo::after { -webkit-text-stroke-width: 3px; }
	.pitch { position: absolute; left: 72px; top: 430px; bottom: 120px; display: flex; flex-direction: column; justify-content: center; gap: 48px; }
	.lede { font-size: 56px; font-weight: 800; max-width: 500px; line-height: 1.05; }
	.parts { list-style: none; margin: 0; padding: 0; display: flex; gap: 20px; }
	.parts li { display: grid; justify-items: center; gap: 12px; font-size: 22px; font-weight: 800; text-transform: uppercase; }
	.parts img { width: 112px; height: 112px; object-fit: contain; filter: drop-shadow(6px 8px 0 rgba(42, 26, 30, .35)); }

	.uno { position: absolute; right: -40px; bottom: 150px; width: 520px; transform: rotate(-8deg); filter: drop-shadow(10px 12px 0 rgba(42, 26, 30, .45)); }

	.bottom { position: absolute; left: 72px; right: 72px; bottom: 56px; display: flex; justify-content: space-between; font-family: var(--mono); font-weight: 700; font-size: 26px; border-top: 3px solid rgba(255,255,255,.4); padding-top: 22px; }
</style>
