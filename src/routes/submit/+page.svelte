<script>
	import { SITE_URL } from '#lib/data.js';

	let { data, form } = $props();
	let preview = $state('');
	let resizing = $state(false);
	let sending = $state(false);
	let image = $state();
	let query = $state('');
	let desc = $state('');
	const shownIds = $derived(new Set(data.members.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase())).map((m) => m.id)));
	$effect.pre(() => {
		if (form?.desc) desc = form.desc;
		if (form?.success && preview) {
			URL.revokeObjectURL(preview);
			preview = '';
			desc = '';
		}
	});

	const MAX_SIDE = 1600;

	async function pick(e) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = '';
		if (!file) return;
		resizing = true;
		try {
			const bitmap = await createImageBitmap(file);
			const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
			const canvas = document.createElement('canvas');
			canvas.width = Math.round(bitmap.width * scale);
			canvas.height = Math.round(bitmap.height * scale);
			canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
			const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
			const dt = new DataTransfer();
			dt.items.add(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
			image.files = dt.files;
			if (preview) URL.revokeObjectURL(preview);
			preview = URL.createObjectURL(blob);
		} finally {
			resizing = false;
		}
	}
</script>

<svelte:window onpageshow={() => (sending = false)} />

<svelte:head>
	<title>Submit a project | Fraser Comp Sci Club</title>
	<meta name="description" content="Show off something you built on the Fraser Comp Sci Club site.">
	<link rel="canonical" href="{SITE_URL}/submit">
</svelte:head>

<main class="section submit halftone">
	<div class="wrap">
		<a class="brand" href="/"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club logo" width="56" height="56"></a>
		<h1 class="section-title"><span class="echo" data-echo="Submit a project">Submit a project</span></h1>

		{#if !data.ready}
			<p class="err">Submissions are down right now.</p>
		{:else}
			{#if form?.success}
				<p class="done">Added {form.success}!{#if form.meeting} <a href="/meeting{form.meeting}">See meeting {form.meeting} →</a>{/if}</p>
			{/if}

			<form method="POST" enctype="multipart/form-data" onsubmit={() => (sending = true)}>
				<div class="photo">
					{#if preview}<img src={preview} alt="Selected project">{:else}<span>No photo yet</span>{/if}
					<div class="photo-btns">
						<label class="btn btn--solid">Take photo<input type="file" accept="image/*" capture="environment" onchange={pick} hidden></label>
						<label class="btn btn--ghost">From gallery<input type="file" accept="image/*" onchange={pick} hidden></label>
					</div>
					<input type="file" name="image" bind:this={image} hidden>
				</div>

				<label>Project name <small>required</small><input name="name" required value={form?.success ? '' : (form?.name ?? '')}></label>
				<fieldset>
					<legend>Authors <small>pick at least one</small></legend>
					<input class="search" type="search" placeholder="search members..." aria-label="Search members" bind:value={query}>
					<div class="people">
						{#each data.members as m (m.id)}
							<label class="person" hidden={!shownIds.has(m.id)}><input type="checkbox" name="member" value={m.id} checked={!form?.success && form?.members?.includes(m.id)}>{m.name}</label>
						{/each}
					</div>
				</fieldset>
				<label>Meeting
					<select name="meeting" value={String(form?.success ? '' : (form?.meeting ?? ''))}>
						<option value="">not from a meeting</option>
						{#each data.meetings as m}<option value={String(m.n)}>{String(m.n).padStart(2, '0')} · {m.title}</option>{/each}
					</select>
				</label>
				<label>Type
					<select name="type" value={form?.success ? 'hw' : (form?.type ?? 'hw')}>
						<option value="hw">Hardware</option>
						<option value="sw">Software</option>
						<option value="both">HW + SW</option>
					</select>
				</label>
				<label>Description <small>optional, {desc.length}/{data.maxDesc}</small><textarea name="desc" rows="3" maxlength={data.maxDesc} bind:value={desc}></textarea></label>
				<label>GitHub link <small>optional</small><input name="github" inputmode="url" placeholder="https://github.com/..." value={form?.success ? '' : (form?.github ?? '')}></label>
				<label>Other link <small>optional</small><input name="other" inputmode="url" placeholder="https://..." value={form?.success ? '' : (form?.other ?? '')}></label>

				{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
				<button class="btn btn--solid" disabled={sending || resizing || !preview}>{sending ? 'Uploading...' : resizing ? 'Loading photo...' : 'Submit project →'}</button>
			</form>

		{/if}
	</div>
</main>

<style>
	.submit { min-height: 100vh; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); }
	.wrap { max-width: 560px; }
	.brand img { width: 56px; margin-bottom: 18px; }
	.section-title { font-size: clamp(44px, 10vw, 80px); }
	form { display: grid; gap: 14px; margin-top: 28px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	input, select, textarea { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus, select:focus, textarea:focus { outline: none; border-color: var(--white); }
	option { color: var(--ink); }
	textarea { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; resize: vertical; }
	fieldset { border: none; padding: 0; margin: 0; display: grid; gap: 6px; min-width: 0; }
	legend { padding: 0; margin-bottom: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	legend small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	.people { display: grid; gap: 2px; max-height: 220px; overflow-y: auto; border: 2px solid rgba(255,255,255,.5); border-radius: 5px; background: rgba(0,0,0,.12); padding: 6px; }
	.person { display: flex; align-items: center; gap: 10px; text-transform: none; font-family: var(--mono); font-weight: 400; padding: 6px 8px; cursor: pointer; }
	.person[hidden] { display: none; }
	.person input { width: auto; accent-color: var(--white); }
	.photo { display: grid; gap: 10px; }
	.photo > img, .photo > span { width: 100%; aspect-ratio: 4 / 3; border-radius: 8px; background: rgba(0,0,0,.18); object-fit: contain; }
	.photo > span { display: grid; place-items: center; font-family: var(--mono); border: 2px dashed rgba(255,255,255,.5); }
	.photo-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
	.photo-btns .btn { display: flex; cursor: pointer; font-size: 16px; }
	.err { background: var(--ink); padding: 12px 16px; border-radius: 5px; font-family: var(--mono); font-size: 16px; font-weight: 700; border-left: 6px solid var(--white); }
	.done { margin-top: 20px; background: var(--white); color: var(--ink); padding: 12px 16px; border-radius: 5px; font-weight: 800; font-size: 18px; }
	.done a { color: var(--red); }
	.btn { margin-top: 6px; cursor: pointer; font-size: 20px; }
	.btn:disabled { opacity: .7; cursor: default; }
</style>
