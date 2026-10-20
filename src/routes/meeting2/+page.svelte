<script>
	import { untrack } from 'svelte';
	import Bracket from '#lib/bracket.svelte';
	import { stages } from '#lib/bracket.js';
	import { SITE_URL, SKILLS } from '#lib/data.js';

	const DESCRIPTION = 'Meeting 2: Smash Ultimate tourney. $20 to the winner. Double elimination pools on Thu Oct 22, top 16 on Thu Nov 5.';

	let { data, form } = $props();
	let sending = $state(false);
	let missing = $state([]);

	const initial = untrack(() => form);
	let name = $state(initial?.name ?? '');
	let email = $state(initial?.email ?? '');
	let skill = $state(initial?.skill ?? '');
	let characters = $state(initial?.characters ?? '');
	let controller = $state(initial?.controller ?? '');
	let welcome = $state('');
	let looked = '';

	const list = $derived(stages(data.bracket));
	const champ = $derived.by(() => {
		const top = list.find((s) => s.key === 'top');
		return top?.advance[0] != null ? top.pool.players[top.advance[0]] : '';
	});

	async function lookup() {
		const value = email.trim().toLowerCase();
		if (value === looked || !/^\S+@\S+\.\S+$/.test(value)) return;
		looked = value;
		const found = await fetch(`/meeting2/lookup?email=${encodeURIComponent(value)}`).then((r) => r.json()).catch(() => ({}));
		if (value !== email.trim().toLowerCase() || !found.name) return;
		name ||= found.name;
		skill ||= found.skill ?? '';
		characters ||= found.characters ?? '';
		controller ||= found.controller ?? '';
		missing = [];
		welcome = found.returning ? `Welcome back ${found.name}! You're already signed up, change anything and sign up again to update.` : `Hey ${found.name}! Filled in from your club signup.`;
	}

	function submit(e) {
		const d = new FormData(e.currentTarget);
		missing = ['name', 'email', 'skill', 'controller'].filter((k) => !String(d.get(k) ?? '').trim());
		if (!missing.includes('email') && !/^\S+@\S+\.\S+$/.test(String(d.get('email')).trim())) missing.push('email');
		if (missing.length) return e.preventDefault();
		sending = true;
	}

	const clear = (k) => (missing = missing.filter((m) => m !== k));
	const labels = { name: 'name', email: 'a valid email', skill: 'skill level', controller: 'controller' };
	const fighter = (f) => `https://www.smashbros.com/assets_v2/img/fighter/${f}/main.png`;
</script>

<svelte:window onpageshow={() => (sending = false)} />

<svelte:head>
	<title>Meeting 2: Smash tourney | Fraser Comp Sci Club</title>
	<meta name="description" content={DESCRIPTION}>
	<link rel="canonical" href="{SITE_URL}/meeting2">
	<meta property="og:title" content="Meeting 2: Smash tourney | Fraser Comp Sci Club">
	<meta property="og:description" content={DESCRIPTION}>
	<meta property="og:url" content="{SITE_URL}/meeting2">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
</svelte:head>

<div class="bar">
	<a class="brand" href="/#meetings"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club" width="36" height="36"><span>Meeting 02</span></a>
	<a class="signup" href="#signup">Sign up</a>
</div>

<main>
	<header class="section halftone">
		<div class="wrap hero">
			<div>
				<span class="label">Thu Oct 22 + Thu Nov 5 · Lunch · Rm 183</span>
				<h1 class="section-title"><span class="echo" data-echo="Smash!!">Smash!!</span></h1>
				<p class="section-lede">Super Smash Bros. Ultimate tourney over two Thursdays. Any skill level welcome. <b>$20 to the winner!</b></p>
				<div class="ctas">
					<a class="btn btn--solid" href="#signup">Sign up →</a>
					{#if list.length}<a class="btn btn--ghost" href="#bracket">See bracket</a>{/if}
				</div>
			</div>
			<div class="art">
				<img class="sparkles" src="/assets/deco/sparkles.webp" alt="">
				<img class="f f--pikachu" src={fighter('pikachu')} alt="Pikachu">
				<img class="f f--mario" src={fighter('mario')} alt="Mario">
				<img class="f f--kirby" src={fighter('kirby')} alt="Kirby">
				<div class="sticker"><b>$20</b><span>to the winner</span></div>
			</div>
		</div>
	</header>

	<div class="guide">
		<section class="row">
			<div class="card">
				<span class="when">Week 1 · Thu Oct 22</span>
				<h2>Pools</h2>
				<p>Everyone gets split into pools, sized by how many people sign up. Each pool is <b>double elimination, best of 1</b>.</p>
				<p>Pools play down to the <b>top 16</b>.</p>
				<div class="sets"><i></i><i class="x"></i></div>
				<img class="peek" src={fighter('link')} alt="Link" loading="lazy">
			</div>
			<div class="card">
				<span class="when">Week 2 · Thu Nov 5</span>
				<h2>Top 16</h2>
				<p>A fresh double elimination bracket. Every set is <b>best of 3</b>, grand finals are <b>best of 5</b>.</p>
				<p>Winner takes home <b>$20</b>!</p>
				<div class="sets"><i></i><i></i><i class="x"></i></div>
				<img class="peek" src={fighter('sonic')} alt="Sonic" loading="lazy">
			</div>
		</section>
	</div>

	<section class="section halftone signup-section" id="signup">
		<img class="cat" src={fighter('steve')} alt="Steve" loading="lazy">
		<div class="wrap split">
			<div class="intro">
				<h2 class="section-title"><span class="echo" data-echo="Sign up!">Sign up!</span></h2>
				{#if data.count}<p class="count"><b>{data.count}</b> signed up so far</p>{/if}
			</div>

			{#if form?.success}
				<div class="done">
					<p>You're in!</p>
					<span>See you Thursday Oct 22 at lunch in Room 183.</span>
				</div>
			{:else}
				<form method="POST" novalidate onsubmit={submit}>
					<label class:bad={missing.includes('email')}>Email<input name="email" inputmode="email" autocomplete="email" placeholder="123456@pdsb.net" bind:value={email} oninput={() => clear('email')} onblur={lookup}></label>
					{#if welcome}<p class="welcome">{welcome}</p>{/if}
					<label class:bad={missing.includes('name')}>Name<input name="name" autocomplete="name" bind:value={name} oninput={() => clear('name')} onfocus={lookup}></label>
					<fieldset class:bad={missing.includes('skill')}>
						<legend>Skill level</legend>
						{#each SKILLS as s}<label class="opt"><input type="radio" name="skill" value={s} bind:group={skill} onchange={() => clear('skill')}>{s}</label>{/each}
					</fieldset>
					<label>Preferred characters <small>optional</small><input name="characters" placeholder="Kirby, Steve..." bind:value={characters}></label>
					<fieldset class:bad={missing.includes('controller')}>
						<legend>Controller</legend>
						{#each [['own', 'Bringing my own'], ['need', 'Need to borrow one']] as [value, label]}<label class="opt"><input type="radio" name="controller" {value} bind:group={controller} onchange={() => clear('controller')}>{label}</label>{/each}
					</fieldset>
					{#if missing.length}
						<p class="err" role="alert">Not submitted! Missing {missing.map((k) => labels[k]).join(', ')}.</p>
					{:else if form?.error}
						<p class="err" role="alert">{form.error}</p>
					{/if}
					<button class="btn btn--solid" disabled={sending}>{sending ? 'Signing up...' : 'Sign up →'}</button>
				</form>
			{/if}
		</div>
	</section>

	{#if list.length}
		<div class="guide" id="bracket">
			<section class="bracket">
				<h2>Bracket</h2>
				{#if champ}<p class="champ">Champion: <b>{champ}</b>!!</p>{/if}
				{#each [...list].reverse() as stage (stage.key)}
					<h3>{stage.title}</h3>
					<Bracket {stage} />
				{/each}
			</section>
		</div>
	{/if}
</main>

<style>
	.bar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px var(--gutter); background: var(--ink); box-shadow: 0 4px 0 var(--red-dark); }
	.bar .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 800; text-transform: uppercase; }
	.bar .brand img { width: 36px; }
	.signup { font-weight: 800; text-transform: uppercase; font-size: 14px; padding: 8px 12px 5px; border-radius: 5px; background: var(--white); color: var(--ink); text-decoration: none; }

	header { background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); padding: clamp(40px, 6vw, 80px) 0; overflow: hidden; }
	.hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 64px); align-items: center; }
	header .label { display: block; margin-bottom: 10px; font-size: 14px; }
	header .section-title { font-size: clamp(64px, 11vw, 140px); }
	.section-lede b { background: var(--red-dark); padding: 0 5px; }
	.ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
	.art { position: relative; }
	.art { min-height: clamp(260px, 32vw, 420px); }
	.f { position: absolute; bottom: 0; height: auto; filter: drop-shadow(8px 10px 0 rgba(42, 26, 30, .3)); }
	.f--pikachu { left: 0; width: 38%; bottom: 4%; }
	.f--mario { left: 24%; width: 52%; z-index: 1; }
	.f--kirby { right: 0; width: 34%; bottom: 8%; }
	.sticker { z-index: 2; }
	.art .sparkles { position: absolute; left: -24px; top: -36px; width: clamp(56px, 7vw, 96px); }
	.sticker { position: absolute; right: -6px; bottom: -28px; display: grid; place-items: center; width: clamp(110px, 13vw, 150px); aspect-ratio: 1; border-radius: 50%; background: var(--white); color: var(--red); transform: rotate(10deg); box-shadow: 5px 5px 0 var(--ink); text-align: center; }
	.sticker b { font-size: clamp(38px, 4.5vw, 54px); line-height: .8; margin-top: 10px; }
	.sticker span { font-family: var(--mono); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--ink); margin-top: -18px; }


	.guide { background: var(--cream); color: var(--ink); padding: clamp(40px, 5vw, 64px) var(--gutter); }
	.row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
	.card { position: relative; overflow: hidden; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: 22px 22px 56px; box-shadow: 6px 6px 0 var(--red); }
	.when { font-family: var(--mono); font-weight: 700; font-size: 13px; text-transform: uppercase; color: #5d4449; }
	h2 { font-size: clamp(34px, 4vw, 52px); color: var(--red); margin: 6px 0 14px; }
	.card p { font-size: 17px; line-height: 1.45; color: #4a3a3e; }
	.card p + p { margin-top: 10px; }
	.card b { color: var(--ink); }
	.peek { position: absolute; right: -10px; bottom: -30px; width: clamp(110px, 12vw, 170px); pointer-events: none; }
	.card p, .card h2, .card .when { position: relative; z-index: 1; max-width: 78%; }
	.sets { position: absolute; left: 22px; bottom: 20px; display: flex; gap: 6px; }
	.sets i { width: 22px; height: 22px; border-radius: 50%; background: var(--red); }
	.sets i.x { background: none; border: 3px solid var(--ink); position: relative; }
	.sets i.x::after { content: "×"; position: absolute; inset: 0; display: grid; place-items: center; font-style: normal; font-weight: 800; font-size: 18px; line-height: 1; }

	.signup-section { position: relative; overflow: hidden; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); padding: clamp(40px, 6vw, 80px) 0; }
	.cat { position: absolute; left: -20px; bottom: -30px; width: clamp(160px, 18vw, 260px); opacity: .9; pointer-events: none; z-index: -1; }
	.split { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1fr); gap: clamp(24px, 5vw, 72px); align-items: start; max-width: 1100px; }
	.signup-section h2 { color: var(--white); font-size: clamp(48px, 8vw, 84px); margin: 0 0 18px; }
	.count { font-family: var(--mono); text-transform: uppercase; font-size: 15px !important; }
	.count b { display: inline-block; font-family: var(--display); font-size: 40px; background: var(--white); color: var(--red); padding: 4px 12px 0; border-radius: 6px; margin-right: 8px; vertical-align: middle; }
	form { display: grid; gap: 14px; background: rgba(0,0,0,.14); border: 2px solid rgba(255,255,255,.35); border-radius: var(--radius); padding: clamp(18px, 3vw, 28px); }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	input { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus { outline: none; border-color: var(--white); }
	.bad input { border: 3px solid var(--ink); background: rgba(0,0,0,.3); }
	.welcome { background: var(--white); color: var(--ink); padding: 10px 14px; border-radius: 5px; font-weight: 700; }
	fieldset { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; border: none; border-radius: 5px; }
	legend { width: 100%; padding: 0; margin-bottom: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	.opt { display: flex; align-items: center; gap: 8px; text-transform: none; font-size: 16px; padding: 10px 14px 8px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); cursor: pointer; }
	.opt:has(:checked) { background: var(--white); color: var(--red); border-color: var(--white); }
	.opt input { width: 18px; height: 18px; margin: 0; padding: 0; border: none; accent-color: var(--red); }
	fieldset.bad { outline: 3px solid var(--ink); outline-offset: 4px; }
	.err { background: var(--ink); padding: 12px 16px; border-radius: 5px; font-family: var(--mono); font-size: 16px; font-weight: 700; border-left: 6px solid var(--white); }
	.btn { cursor: pointer; font-size: 20px; }
	form .btn { margin-top: 6px; }
	.btn:disabled { opacity: .7; cursor: wait; }
	.done { display: grid; gap: 10px; background: var(--white); color: var(--ink); border-radius: var(--radius); padding: 28px; box-shadow: 6px 6px 0 var(--ink); }
	.done p { font-weight: 800; text-transform: uppercase; font-size: 40px; color: var(--red); line-height: 1; }
	.done span { font-size: 18px; }

	.bracket { max-width: 1200px; margin: 0 auto; }
	.bracket h3 { font-size: 26px; margin: 28px 0 12px; }
	.champ { font-size: 24px; font-weight: 800; text-transform: uppercase; }
	.champ b { background: var(--red); color: var(--white); padding: 0 6px; }

	@media (max-width: 900px) {
		.row { grid-template-columns: 1fr; }
		.hero, .split { grid-template-columns: 1fr; }
		.art { max-width: 480px; width: 100%; margin: 12px auto 24px; }
		.cat { display: none; }
	}
</style>
