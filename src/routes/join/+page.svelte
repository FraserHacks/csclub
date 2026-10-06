<script>
	import { SITE_URL, CLASSROOM_CODE, CLASSROOM_URL } from '#lib/data.js';

	let { form } = $props();
	let sending = $state(false);
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
		<p class="section-lede">Sign up, show up in the member directory, then we'll send you to our Google Classroom.</p>

		<form method="POST" onsubmit={() => (sending = true)}>
			<label>Name<input name="name" autocomplete="name" value={form?.name ?? ''}></label>
			<label>Email<input name="email" inputmode="email" autocomplete="email" value={form?.email ?? ''}></label>
			<label>Grade
				<select name="grade" value={form?.grade ?? ''}>
					<option value="">pick one</option>
					{#each ['9', '10', '11', '12'] as g}<option value={g}>{g}</option>{/each}
				</select>
			</label>
			<label>GitHub <small>optional</small><input name="github" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="username" value={form?.github ?? ''}></label>
			{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
			<button class="btn btn--solid" disabled={sending}>{sending ? 'Joining...' : 'Join →'}</button>
		</form>

		<p class="code">Classroom code <code>{CLASSROOM_CODE}</code> · <a href={CLASSROOM_URL}>open Classroom</a></p>
	</div>
</main>

<style>
	.join-page { min-height: 100vh; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); }
	.wrap { max-width: 560px; }
	.brand img { width: 56px; margin-bottom: 18px; }
	.section-title { font-size: clamp(44px, 10vw, 80px); }
	form { display: grid; gap: 14px; margin-top: 28px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	input, select { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus, select:focus { outline: none; border-color: var(--white); }
	option { color: var(--ink); }
	.err { background: var(--ink); padding: 10px 14px; border-radius: 5px; font-family: var(--mono); font-size: 14px; }
	.btn { margin-top: 6px; cursor: pointer; font-size: 20px; }
	.btn:disabled { opacity: .7; cursor: wait; }
	.code { margin-top: 28px; font-family: var(--mono); font-size: 14px; }
	.code code { font-weight: 700; font-size: 18px; background: var(--white); color: var(--ink); padding: 2px 8px; border-radius: 4px; }
</style>
