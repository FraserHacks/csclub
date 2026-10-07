<script>
	import { SITE_URL, CLASSROOM_CODE, CLASSROOM_URL, INSTAGRAM } from '#lib/data.js';

	let { form } = $props();
	let sending = $state(false);
	let missing = $state([]);

	function submit(e) {
		const data = new FormData(e.currentTarget);
		missing = ['name', 'email', 'grade'].filter((k) => !String(data.get(k) ?? '').trim());
		if (!missing.includes('email') && !/^\S+@\S+\.\S+$/.test(String(data.get('email')).trim())) missing.push('email');
		if (missing.length) return e.preventDefault();
		sending = true;
	}

	const clear = (k) => (missing = missing.filter((m) => m !== k));
	const labels = { name: 'name', email: 'a valid school email', grade: 'grade' };
</script>

<svelte:window onpageshow={() => (sending = false)} />

<svelte:head>
	<title>Join | Fraser Comp Sci Club</title>
	<meta name="description" content="Join Fraser Comp Sci Club: sign up, get added to the member directory and our Google Classroom.">
	<link rel="canonical" href="{SITE_URL}/join">
	<meta property="og:title" content="Join Fraser Comp Sci Club">
	<meta property="og:url" content="{SITE_URL}/join">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
</svelte:head>

<main class="section join-page halftone">
	<div class="wrap">
		<a class="brand" href="/"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club logo" width="56" height="56"></a>
		<h1 class="section-title"><span class="echo" data-echo="Join the club!">Join the club!</span></h1>
		<p class="section-lede"><b>No experience needed.</b> Signing up gets you listed in the <a href="/#members">member directory</a> on this site, then you'll get our Google Classroom code.</p>

		{#if form?.success}
			<div class="done">
				<p>You're in! Google Classroom Code:</p>
				<code>{CLASSROOM_CODE}</code>
				<a class="btn btn--solid" href={CLASSROOM_URL}>Open Classroom →</a>
			</div>
		{:else}
		<form method="POST" novalidate onsubmit={submit}>
			<label class:bad={missing.includes('name')}>Name<input name="name" autocomplete="name" value={form?.name ?? ''} oninput={() => clear('name')}></label>
			<label class:bad={missing.includes('email')}>School email<input name="email" inputmode="email" autocomplete="email" placeholder="123456@pdsb.net" value={form?.email ?? ''} oninput={() => clear('email')}></label>
			<label class:bad={missing.includes('grade')}>Grade
				<select name="grade" value={form?.grade ?? ''} onchange={() => clear('grade')}>
					<option value="">pick one</option>
					{#each ['9', '10', '11', '12'] as g}<option value={g}>{g}</option>{/each}
				</select>
			</label>
			{#if missing.length}
				<p class="err" role="alert">Not submitted! Missing {missing.map((k) => labels[k]).join(', ')}.</p>
			{:else if form?.error}
				<p class="err" role="alert">{form.error}</p>
			{/if}
			<button class="btn btn--solid" disabled={sending}>{sending ? 'Joining...' : 'Join →'}</button>
		</form>
		{/if}

		<p class="insta">Once you submit, follow our Instagram! <a href="https://instagram.com/{INSTAGRAM}" target="_blank" rel="noopener">@{INSTAGRAM}</a></p>
		{#if !form?.success}<p class="code">Classroom code <code>{CLASSROOM_CODE}</code> · <a href={CLASSROOM_URL}>open Classroom</a></p>{/if}
	</div>
</main>

<style>
	.join-page { min-height: 100vh; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); }
	.wrap { max-width: 560px; }
	.brand img { width: 56px; margin-bottom: 18px; }
	.section-title { font-size: clamp(44px, 10vw, 80px); }
	form { display: grid; gap: 14px; margin-top: 28px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	input, select { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus, select:focus { outline: none; border-color: var(--white); }
	.bad input, .bad select { border: 3px solid var(--ink); background: rgba(0,0,0,.3); }
	option { color: var(--ink); }
	.err { background: var(--ink); padding: 12px 16px; border-radius: 5px; font-family: var(--mono); font-size: 16px; font-weight: 700; border-left: 6px solid var(--white); }
	.btn { margin-top: 6px; cursor: pointer; font-size: 20px; }
	.btn:disabled { opacity: .7; cursor: wait; }
	.insta { margin-top: 28px; font-weight: 800; font-size: 18px; }
	.code { margin-top: 14px; font-family: var(--mono); font-size: 14px; }
	.code code { font-weight: 700; font-size: 18px; background: var(--white); color: var(--ink); padding: 2px 8px; border-radius: 4px; }
	.done { margin-top: 28px; display: grid; justify-items: start; gap: 14px; }
	.done p { font-weight: 800; text-transform: uppercase; font-size: 22px; }
	.done code { font-family: var(--mono); font-weight: 700; font-size: clamp(40px, 12vw, 72px); background: var(--white); color: var(--ink); padding: 8px 20px; border-radius: 6px; letter-spacing: .06em; word-break: break-all; }
	@media (max-width: 520px) {
		.code code { display: block; width: max-content; margin: 8px 0; font-size: 32px; padding: 6px 14px; letter-spacing: .06em; }
	}
</style>
