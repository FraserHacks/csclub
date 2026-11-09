<script>
	import { INSTAGRAM } from '#lib/data.js';

	const tags = ['HTML', 'CSS', 'GitHub Pages'];

	let w = $state(1080);
	let h = $state(1080);
	const scale = $derived(Math.min(1, w / 1080, h / 1080));
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<svelte:head>
	<title>Meeting 4 post | Fraser Comp Sci Club</title>
	<meta name="robots" content="noindex">
</svelte:head>

<div class="stage">
	<div class="frame" style="width: {1080 * scale}px; height: {1080 * scale}px">
		<article class="post halftone" style="transform: scale({scale})">
			<div class="top">
				<span class="brand"><img src="/assets/logo_small.webp" alt="" width="56" height="56">Meeting 04</span>
				<span class="open">Open meeting · No sign up needed</span>
			</div>

			<h1><span class="echo" data-echo="Your own site!!">Your own site!!</span></h1>
			<p class="when"><span>Thu Nov 12</span><span>11:05 AM</span><span>Rm 183</span></p>
			<div class="pitch">
				<p class="lede">Build a website about you. Put it online for free.</p>
				<ul class="tags">
					{#each tags as t}<li>{t}</li>{/each}
				</ul>
			</div>

			<div class="window">
				<div class="chrome"><i></i><i></i><i></i><span>you.github.io</span></div>
				<div class="site">
					<b>Hi, I'm you!</b>
					<p></p>
					<p class="short"></p>
					<div class="cards"><div></div><div></div></div>
				</div>
			</div>

			<div class="bottom">
				<span>cs.fraserhacks.dev/meeting4</span>
				<span>@{INSTAGRAM}</span>
			</div>
		</article>
	</div>
</div>

<style>
	.stage { min-height: 100vh; display: grid; place-items: center; background: var(--ink); }
	.frame { overflow: hidden; }
	.post { position: relative; width: 1080px; height: 1080px; transform-origin: top left; overflow: hidden; padding: 64px 72px; background: linear-gradient(140deg, var(--cyan) 0%, var(--cyan-deep) 100%); color: var(--white); }

	.top { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-weight: 700; font-size: 26px; text-transform: uppercase; }
	.brand { display: flex; align-items: center; gap: 14px; }
	.brand img { width: 56px; }
	.open { background: var(--white); color: var(--ink); padding: 10px 18px 8px; border-radius: 999px; font-size: 22px; }

	h1 { margin-top: 40px; font-size: 140px; }
	.when { display: inline-flex; margin-top: 24px; background: var(--white); color: var(--ink); border-radius: 12px; box-shadow: 8px 8px 0 var(--ink); font-size: 46px; font-weight: 800; text-transform: uppercase; line-height: 1; }
	.when span { padding: 18px 26px 12px; }
	.when span + span { border-left: 4px solid var(--cyan-deep); }
	.when span:first-child { background: var(--red); color: var(--white); border-radius: 12px 0 0 12px; }
	.echo::after { -webkit-text-stroke-width: 3px; }
	.pitch { position: absolute; left: 72px; top: 430px; bottom: 120px; display: flex; flex-direction: column; justify-content: center; gap: 40px; }
	.lede { font-size: 56px; font-weight: 800; max-width: 460px; line-height: 1.05; }
	.tags { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; max-width: 460px; }
	.tags li { font-family: var(--mono); font-size: 24px; font-weight: 700; background: var(--ink); padding: 10px 16px 8px; border-radius: 8px; }

	.window { position: absolute; right: -30px; bottom: 170px; width: 500px; transform: rotate(-6deg); background: var(--white); color: var(--ink); border: 5px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: 12px 14px 0 rgba(42, 26, 30, .45); }
	.chrome { display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: var(--sky-light); border-bottom: 5px solid var(--ink); }
	.chrome i { width: 18px; height: 18px; border-radius: 50%; background: var(--red); }
	.chrome i:nth-child(2) { background: #f2c230; }
	.chrome i:nth-child(3) { background: #3fb950; }
	.chrome span { margin-left: 12px; font-family: var(--mono); font-size: 22px; font-weight: 700; }
	.site { display: grid; gap: 16px; padding: 32px 30px 36px; }
	.site b { font-size: 48px; text-transform: uppercase; color: var(--red); line-height: 1; }
	.site p { height: 16px; border-radius: 8px; background: #e2dcdd; }
	.site p.short { width: 60%; }
	.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 8px; }
	.cards div { height: 110px; border: 4px solid var(--ink); border-radius: 10px; }

	.bottom { position: absolute; left: 72px; right: 72px; bottom: 56px; display: flex; justify-content: space-between; font-family: var(--mono); font-weight: 700; font-size: 26px; border-top: 3px solid rgba(255,255,255,.4); padding-top: 22px; }
</style>
