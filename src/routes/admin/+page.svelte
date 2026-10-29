<script>
	let { data, form } = $props();
	let preview = $state('');
	let resizing = $state(false);
	let sending = $state(false);
	let image = $state();
	let tab = $state('add');
	let memberQuery = $state('');
	let chosen = $state([]);
	let editing = $state(null);
	let editChosen = $state([]);
	$effect.pre(() => {
		if (form?.deleted || form?.edited || (form?.error && !('name' in form))) tab = 'projects';
		chosen = form?.success ? [] : (form?.members ?? []).map(String);
		editing = null;
	});

	const tabs = $derived([
		['add', 'Add'],
		['projects', `Projects (${data.projects?.length ?? 0})`],
		['members', `Members (${data.members?.length ?? 0})`]
	]);
	const memberRows = $derived.by(() => {
		const q = memberQuery.trim().toLowerCase();
		return (data.members ?? []).filter((m) => !q || [m.name, m.email, m.github].some((s) => s.toLowerCase().includes(q)));
	});
	const builds = (id) => data.projects.filter((p) => p.memberIds.includes(id)).length;
	const memberName = (id) => data.members.find((m) => String(m.id) === id)?.name;
	function choose(list, e) {
		if (e.currentTarget.value) list.push(e.currentTarget.value);
		e.currentTarget.value = '';
	}
	function edit(p) {
		editChosen = p.memberIds.map(String);
		editing = editing === p.id ? null : p.id;
	}
	const meetingName = (n) => data.meetings.find((m) => m.n === n)?.title;

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

{#snippet picker(list)}
	<label>Built by
		<select onchange={(e) => choose(list, e)}>
			<option value="">{list.length ? 'add another member' : 'pick a member'}</option>
			{#each data.members.filter((m) => m.name && !m.hidden && !list.includes(String(m.id))) as m}<option value={String(m.id)}>{m.name}</option>{/each}
		</select>
	</label>
	{#if list.length}
		<div class="chosen">
			{#each list as id, i (id)}
				<button type="button" class="chip" aria-label="Remove {memberName(id)}" onclick={() => list.splice(i, 1)}>{memberName(id)} ×</button>
				<input type="hidden" name="member" value={id}>
			{/each}
		</div>
	{/if}
{/snippet}

<svelte:window onpageshow={() => (sending = false)} />

<svelte:head>
	<title>Admin | Fraser Comp Sci Club</title>
	<meta name="robots" content="noindex">
</svelte:head>

<main class="section admin halftone">
	<div class="wrap">
		<a class="brand" href="/"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club logo" width="56" height="56"></a>
		<h1 class="section-title"><span class="echo" data-echo="Add a project">Add a project</span></h1>

		{#if !data.authed}
			{#if data.enabled}
				<form method="POST" action="?/login">
					<label>Password<input name="password" type="password" autocomplete="current-password"></label>
					{#if form?.loginError}<p class="err" role="alert">{form.loginError}</p>{/if}
					<button class="btn btn--solid">Log in →</button>
				</form>
			{:else}
				<p class="err">ADMIN_PASSWORD isn't set.</p>
			{/if}
		{:else}
			<div class="tabs" role="group" aria-label="Admin sections">
				{#each tabs as [value, label]}<button class="tab" aria-pressed={tab === value} onclick={() => (tab = value)}>{label}</button>{/each}
				<a class="tab" href="/admin/bracket">Bracket</a>
			</div>
			{#if form?.deleted}<p class="done">Deleted {form.deleted}.</p>{/if}
			{#if form?.edited}<p class="done">Saved {form.edited}.</p>{/if}
			{#if tab === 'projects' && form?.error}<p class="err" role="alert">{form.error}</p>{/if}

			{#if tab === 'add'}
			{#if !data.ready}<p class="err">Set SUPABASE_URL and SUPABASE_SECRET_KEY to add projects.</p>{/if}
			{#if form?.success}
				<p class="done">Added {form.success}!{#if form.meeting} <a href="/meeting{form.meeting}">See meeting {form.meeting} →</a>{/if}</p>
			{/if}

			<form method="POST" action="?/add" enctype="multipart/form-data" onsubmit={() => (sending = true)}>
				<div class="photo">
					{#if preview}<img src={preview} alt="Selected project">{:else}<span>No photo yet</span>{/if}
					<div class="photo-btns">
						<label class="btn btn--solid">Take photo<input type="file" accept="image/*" capture="environment" onchange={pick} hidden></label>
						<label class="btn btn--ghost">From gallery<input type="file" accept="image/*" onchange={pick} hidden></label>
					</div>
					<input type="file" name="image" bind:this={image} hidden>
				</div>

				<label>Project name<input name="name" required value={form?.success ? '' : (form?.name ?? '')}></label>
				{@render picker(chosen)}
				<label>Meeting
					<select name="meeting" value={String(form?.meeting ?? '')}>
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
				<label>Description <small>optional</small><input name="desc" value={form?.success ? '' : (form?.desc ?? '')}></label>
				<label>Link <small>optional</small><input name="link" inputmode="url" placeholder="https://github.com/..." value={form?.success ? '' : (form?.link ?? '')}></label>

				{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
				<button class="btn btn--solid" disabled={sending || resizing || !preview || !chosen.length}>{sending ? 'Uploading...' : resizing ? 'Loading photo...' : 'Add project →'}</button>
			</form>

			{:else if tab === 'projects'}
				<div class="list">
					{#each data.projects as p (p.id)}
						<div class="item">
							<img src={p.src} alt={p.name} loading="lazy">
							<div>
								<b>{p.name}</b>
								<span>by {p.by || '?'} · {p.type}{#if p.meeting} · meeting {p.meeting}: {meetingName(p.meeting)}{/if}{#if p.hidden} · <i>hidden</i>{/if}</span>
								{#if p.href}<a href={p.href} target="_blank" rel="noopener">{p.href}</a>{/if}
							</div>
							<div class="actions">
								<button class="del" aria-expanded={editing === p.id} onclick={() => edit(p)}>Edit</button>
								<form method="POST" action="?/delete" onsubmit={(e) => confirm(`Delete ${p.name}? This can't be undone.`) || e.preventDefault()}>
									<input type="hidden" name="id" value={p.id}>
									<button class="del">Delete</button>
								</form>
							</div>
							{#if editing === p.id}
								<form class="edit" method="POST" action="?/edit">
									<input type="hidden" name="id" value={p.id}>
									<label>Project name<input name="name" required value={p.name}></label>
									{@render picker(editChosen)}
									<label>Meeting
										<select name="meeting" value={String(p.meeting ?? '')}>
											<option value="">not from a meeting</option>
											{#each data.meetings as m}<option value={String(m.n)}>{String(m.n).padStart(2, '0')} · {m.title}</option>{/each}
										</select>
									</label>
									<label>Type
										<select name="type" value={p.type}>
											<option value="hw">Hardware</option>
											<option value="sw">Software</option>
											<option value="both">HW + SW</option>
										</select>
									</label>
									<label>Description <small>optional</small><input name="desc" value={p.desc}></label>
									<label>Link <small>optional</small><input name="link" inputmode="url" placeholder="https://github.com/..." value={p.href}></label>
									<button class="del" disabled={!editChosen.length}>Save</button>
								</form>
							{/if}
						</div>
					{:else}
						<p class="empty">No projects yet.</p>
					{/each}
				</div>
			{:else}
				<input class="search" type="search" placeholder="search members..." aria-label="Search members" bind:value={memberQuery}>
				<div class="table-wrap">
					<table>
						<thead><tr><th>Name</th><th>Email</th><th>Gr</th><th>GitHub</th><th>Role</th><th>Projects</th><th>Hidden</th></tr></thead>
						<tbody>
							{#each memberRows as m (m.id)}
								<tr class:hidden={m.hidden}>
									<td><b>{m.name || '(no name)'}</b></td>
									<td><a href="mailto:{m.email}">{m.email}</a></td>
									<td>{m.grade}</td>
									<td>{#if m.github}<a href="https://github.com/{m.github}" target="_blank" rel="noopener">@{m.github}</a>{/if}</td>
									<td>{m.role}{m.exec ? ' ★' : ''}</td>
									<td>{builds(m.id) + m.projects.length}</td>
									<td>{m.hidden ? 'yes' : ''}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<form method="POST" action="?/logout"><button class="logout">Log out</button></form>
		{/if}
	</div>
</main>

<style>
	.admin { min-height: 100vh; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); }
	.wrap { max-width: 560px; }
	.wrap:has(.list), .wrap:has(.table-wrap) { max-width: 1100px; }
	.tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 24px; }
	.tab { text-decoration: none; font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 15px; padding: 10px 16px 7px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: transparent; color: var(--white); cursor: pointer; }
	.tab[aria-pressed="true"] { background: var(--white); color: var(--red); border-color: var(--white); }
	.list { display: grid; gap: 10px; margin-top: 20px; }
	.list form { display: block; margin: 0; }
	.item { display: grid; grid-template-columns: 96px 1fr auto; gap: 14px; align-items: center; background: var(--white); color: var(--ink); border-radius: 8px; padding: 10px; }
	.item img { width: 96px; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 6px; }
	.item b { display: block; font-size: 19px; text-transform: uppercase; }
	.item span, .item a { display: block; font-family: var(--mono); font-size: 13px; color: #5d4449; overflow-wrap: anywhere; }
	.del { font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 14px; padding: 8px 12px 5px; border-radius: 5px; border: 2px solid var(--red); background: var(--white); color: var(--red); cursor: pointer; }
	.actions { display: flex; gap: 6px; }
	.list .edit { grid-column: 1 / -1; display: grid; gap: 10px; justify-items: start; }
	.edit label { width: 100%; }
	.edit input, .edit select { color: var(--ink); background: var(--white); border-color: #d7c3c7; }
	.edit input::placeholder { color: #a08a8e; }
	.edit input:focus, .edit select:focus { border-color: var(--ink); }
	.edit .chip { background: var(--ink); color: var(--white); margin-top: 6px; }
	.del:disabled { opacity: .5; cursor: default; }
	.del:hover { background: var(--red); color: var(--white); }
	.empty { margin-top: 10px; font-family: var(--mono); }
	.search { margin-top: 20px; max-width: 320px; }
	.table-wrap { margin-top: 12px; overflow-x: auto; background: var(--white); border-radius: 8px; }
	table { width: 100%; border-collapse: collapse; color: var(--ink); font-size: 15px; }
	th, td { text-align: left; padding: 10px 12px 8px; border-bottom: 1px solid #eadfe1; white-space: nowrap; }
	th { font-family: var(--mono); font-size: 12px; text-transform: uppercase; background: var(--ink); color: var(--white); }
	td a { color: var(--red-deep); }
	tr.hidden td { opacity: .5; }
	@media (max-width: 520px) { .item { grid-template-columns: 72px 1fr; } .item img { width: 72px; } .item .actions { grid-column: 1 / -1; } }
	.brand img { width: 56px; margin-bottom: 18px; }
	.section-title { font-size: clamp(44px, 10vw, 80px); }
	form { display: grid; gap: 14px; margin-top: 28px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label small { font-family: var(--mono); font-weight: 400; text-transform: none; opacity: .8; }
	input, select { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 100%; }
	input::placeholder { color: rgba(255,255,255,.5); }
	input:focus, select:focus { outline: none; border-color: var(--white); }
	option { color: var(--ink); }
	.chosen { display: flex; flex-wrap: wrap; gap: 6px; margin-top: -6px; }
	.chip { font-family: var(--mono); font-size: 14px; font-weight: 700; padding: 6px 10px; border-radius: 5px; border: none; background: var(--white); color: var(--ink); cursor: pointer; }
	.photo { display: grid; gap: 10px; }
	.photo > img, .photo > span { width: 100%; aspect-ratio: 4 / 3; border-radius: 8px; background: rgba(0,0,0,.18); object-fit: contain; }
	.photo > span { display: grid; place-items: center; font-family: var(--mono); border: 2px dashed rgba(255,255,255,.5); }
	.photo-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
	.photo-btns .btn { display: flex; cursor: pointer; font-size: 16px; }
	.err { background: var(--ink); padding: 12px 16px; border-radius: 5px; font-family: var(--mono); font-size: 16px; font-weight: 700; border-left: 6px solid var(--white); margin-top: 20px; }
	.done { margin-top: 20px; background: var(--white); color: var(--ink); padding: 12px 16px; border-radius: 5px; font-weight: 800; font-size: 18px; }
	.done a { color: var(--red); }
	.btn { margin-top: 6px; cursor: pointer; font-size: 20px; }
	.btn:disabled { opacity: .7; cursor: default; }
	.logout { margin-top: 20px; background: none; border: none; color: var(--white); font-family: var(--mono); text-decoration: underline; cursor: pointer; justify-self: start; padding: 0; }
</style>
