<script>
	import Bracket from '#lib/bracket.svelte';
	import { stages } from '#lib/bracket.js';
	import { SITE_URL, SKILLS } from '#lib/data.js';

	const DESCRIPTION = 'Meeting 2: Smash Ultimate tourney. Double elimination pools on Thu Oct 22, top 16 on Thu Nov 5.';

	let { data, form } = $props();
	let sending = $state(false);
	let missing = $state([]);

	const list = $derived(stages(data.bracket));
	const champ = $derived.by(() => {
		const top = list.find((s) => s.key === 'top');
		return top?.advance[0] != null ? top.pool.players[top.advance[0]] : '';
	});

	function submit(e) {
		const d = new FormData(e.currentTarget);
		missing = ['name', 'email', 'skill', 'controller'].filter((k) => !String(d.get(k) ?? '').trim());
		if (!missing.includes('email') && !/^\S+@\S+\.\S+$/.test(String(d.get('email')).trim())) missing.push('email');
		if (d.get('dates') !== 'on') missing.push('dates');
		if (missing.length) return e.preventDefault();
		sending = true;
	}

	const clear = (k) => (missing = missing.filter((m) => m !== k));
	const labels = { name: 'name', email: 'a valid email', skill: 'skill level', controller: 'controller', dates: 'both Thursdays' };
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
		<div class="wrap">
			<span class="label">Thu Oct 22 + Thu Nov 5 · Rm 183</span>
			<h1 class="section-title"><span class="echo" data-echo="Smash!!">Smash!!</span></h1>
			<p class="section-lede">Super Smash Bros. Ultimate tourney over two Thursdays. Lose twice and you're out. <b>Prize for the winner!</b></p>
		</div>
	</header>

	<div class="guide">
		<section class="row">
			<div class="text">
				<span class="when">Week 1 · Thu Oct 22</span>
				<h2>Pools</h2>
				<p>Everyone gets split into pools, sized by how many people sign up. Each pool is <b>double elimination, best of 1</b>.</p>
				<p>Pools play down to the <b>top 16</b>.</p>
			</div>
			<div class="text">
				<span class="when">Week 2 · Thu Nov 5</span>
				<h2>Top 16</h2>
				<p>A fresh double elimination bracket. Every set is <b>best of 3</b>, grand finals are <b>best of 5</b>.</p>
				<p>We have <b>3 Switches</b> and stagger match times so it doesn't get crowded. Check the bracket below to see who you're playing.</p>
			</div>
		</section>
	</div>

	<section class="section halftone signup-section" id="signup">
		<div class="wrap">
			<h2 class="section-title"><span class="echo" data-echo="Sign up!">Sign up!</span></h2>
			<p class="section-lede">Only sign up if you can make <b>both</b> Thursdays.</p>

			{#if form?.success}
				<p class="done">You're in! See you Thursday Oct 22.</p>
			{:else}
				<form method="POST" novalidate onsubmit={submit}>
					<label class:bad={missing.includes('name')}>Name<input name="name" autocomplete="name" value={form?.name ?? ''} oninput={() => clear('name')}></label>
					<label class:bad={missing.includes('email')}>Email<input name="email" inputmode="email" autocomplete="email" placeholder="123456@pdsb.net" value={form?.email ?? ''} oninput={() => clear('email')}></label>
					<label class:bad={missing.includes('skill')}>Skill level
						<select name="skill" value={form?.skill ?? ''} onchange={() => clear('skill')}>
							<option value="">pick one</option>
							{#each SKILLS as s}<option value={s}>{s}</option>{/each}
						</select>
					</label>
					<label>Preferred characters <small>optional</small><input name="characters" placeholder="Kirby, Steve..." value={form?.characters ?? ''}></label>
					<label class:bad={missing.includes('controller')}>Controller
						<select name="controller" value={form?.controller ?? ''} onchange={() => clear('controller')}>
							<option value="">pick one</option>
							<option value="own">Bringing my own</option>
							<option value="need">Need to borrow one</option>
						</select>
					</label>
					<label class="check" class:bad={missing.includes('dates')}>
						<input type="checkbox" name="dates" checked={form?.dates ?? false} onchange={() => clear('dates')}>
						I can make Thu Oct 22 and Thu Nov 5 at lunch
					</label>
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
		<div class="guide">
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

	header { background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); padding: clamp(40px, 6vw, 72px) 0; }
	header .label { display: block; margin-bottom: 10px; font-size: 14px; }
	.section-lede b { background: var(--red-dark); padding: 0 5px; }

	.guide { background: var(--cream); color: var(--ink); padding: clamp(40px, 5vw, 64px) var(--gutter); }
	.row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); }
	.when { font-family: var(--mono); font-weight: 700; font-size: 13px; text-transform: uppercase; color: #5d4449; }
	h2 { font-size: clamp(34px, 4vw, 52px); color: var(--red); margin: 6px 0 18px; }
	.text p { font-size: 18px; line-height: 1.45; color: #4a3a3e; }
	.text p + p { margin-top: 12px; }
	.text b { color: var(--ink); }

	.signup-section { background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); padding: clamp(40px, 6vw, 72px) 0; }
	.signup-section .wrap { max-width: 560px; }
	.signup-section h2 { color: var(--white); font-size: clamp(44px, 8vw, 72px); margin: 0 0 12px; }
	form { display: grid; gap: 14px; margin-top: 28px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	input, select { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus, select:focus { outline: none; border-color: var(--white); }
	.bad input, .bad select { border: 3px solid var(--ink); background: rgba(0,0,0,.3); }
	option { color: var(--ink); }
	.check { grid-template-columns: auto 1fr; align-items: center; gap: 12px; text-transform: none; font-size: 17px; padding: 10px 12px; border-radius: 5px; }
	.check input { width: 22px; height: 22px; accent-color: var(--ink); }
	.check.bad { outline: 3px solid var(--ink); background: rgba(0,0,0,.3); }
	.err { background: var(--ink); padding: 12px 16px; border-radius: 5px; font-family: var(--mono); font-size: 16px; font-weight: 700; border-left: 6px solid var(--white); }
	.btn { margin-top: 6px; cursor: pointer; font-size: 20px; }
	.btn:disabled { opacity: .7; cursor: wait; }
	.done { margin-top: 28px; font-weight: 800; text-transform: uppercase; font-size: 22px; }

	.bracket { max-width: 1200px; margin: 0 auto; }
	.bracket h3 { font-size: 26px; margin: 28px 0 12px; }
	.champ { font-size: 24px; font-weight: 800; text-transform: uppercase; }
	.champ b { background: var(--red); color: var(--white); padding: 0 6px; }

	@media (max-width: 820px) {
		.row { grid-template-columns: 1fr; }
	}
</style>
