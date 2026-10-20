<script>
	import { untrack } from 'svelte';
	import Bracket from '#lib/bracket.svelte';
	import { ready, stages } from '#lib/bracket.js';
	import { SKILLS } from '#lib/data.js';

	let { data } = $props();
	const initial = untrack(() => data);
	let bracket = $state(initial.bracket);
	let picked = $state(initial.entrants.map((e) => e.id));
	let pools = $state(Math.max(1, Math.round(initial.entrants.length / 8)));
	let advance = $state(8);
	let status = $state('');

	const list = $derived(stages(bracket));
	const poolList = $derived(list.filter((s) => s.key !== 'top'));
	const poolsDone = $derived(poolList.length > 0 && poolList.every((s) => s.advance.every((p) => p !== undefined)));
	const upNext = $derived(list.flatMap((s) => s.matches.filter(ready).map((m) => ({ s, m }))));
	const controllers = $derived(data.entrants.filter((e) => picked.includes(e.id) && e.controller).length);

	async function save() {
		status = 'Saving...';
		const res = await fetch('/admin/bracket', { method: 'PUT', body: JSON.stringify($state.snapshot(bracket)) }).catch(() => null);
		status = res?.ok ? 'Saved' : 'Save failed! Try again.';
	}

	function makePools() {
		const ranked = data.entrants
			.filter((e) => picked.includes(e.id))
			.map((e) => ({ name: e.name, rank: SKILLS.indexOf(e.skill) + Math.random() }))
			.sort((a, b) => b.rank - a.rank);
		const groups = Array.from({ length: pools }, () => []);
		ranked.forEach(({ name }, i) => {
			const j = i % pools;
			groups[Math.floor(i / pools) % 2 ? pools - 1 - j : j].push(name);
		});
		bracket = { advance, pools: groups.map((players) => ({ players, winners: {} })), top: null };
		save();
	}

	function startTop() {
		const players = [];
		for (let j = 0; j < bracket.advance; j++)
			for (const s of poolList) if (s.advance[j] != null) players.push(s.pool.players[s.advance[j]]);
		bracket.top = { players, winners: {} };
		save();
	}

	function pick(stage, m, p) {
		if (stage.pool.winners[m.id] === p) delete stage.pool.winners[m.id];
		else stage.pool.winners[m.id] = p;
		save();
	}

	function reset(top) {
		if (!confirm(top ? 'Delete the top bracket and go back to pools?' : 'Delete the whole bracket?')) return;
		if (top) bracket.top = null;
		else bracket = null;
		save();
	}
</script>

<svelte:head>
	<title>Bracket | Fraser Comp Sci Club</title>
	<meta name="robots" content="noindex">
</svelte:head>

<main class="section admin halftone">
	<div class="wrap">
		<a class="back" href="/admin">← Admin</a>
		<h1 class="section-title"><span class="echo" data-echo="Bracket">Bracket</span></h1>
		{#if status}<p class="status">{status}</p>{/if}

		{#if !bracket}
			<p class="note">{picked.length} of {data.entrants.length} signed up playing · {controllers} need a controller</p>
			<div class="table-wrap">
				<table>
					<thead><tr><th></th><th>Name</th><th>Skill</th><th>Characters</th><th>Controller</th></tr></thead>
					<tbody>
						{#each data.entrants as e (e.id)}
							<tr class:off={!picked.includes(e.id)}>
								<td><input type="checkbox" aria-label="Playing: {e.name}" checked={picked.includes(e.id)} onchange={(ev) => (picked = ev.currentTarget.checked ? [...picked, e.id] : picked.filter((id) => id !== e.id))}></td>
								<td><b>{e.name}</b></td>
								<td>{e.skill}</td>
								<td>{e.characters}</td>
								<td>{e.controller ? 'needs one' : ''}</td>
							</tr>
						{:else}
							<tr><td colspan="5">No signups yet.</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="setup">
				<label>Pools<input type="number" min="1" max="16" bind:value={pools}></label>
				<label>Advance per pool
					<select bind:value={advance}>{#each [2, 4, 8, 16] as k}<option value={k}>{k}</option>{/each}</select>
				</label>
				<p>Top {pools * advance} · ~{Math.ceil(picked.length / pools)} per pool</p>
				<button class="btn btn--solid" disabled={picked.length < 2 || pools < 1} onclick={makePools}>Make pools →</button>
			</div>
		{:else}
			{#if upNext.length}
				<h2>Up next</h2>
				<div class="next">
					{#each upNext as { s, m } (s.key + m.id)}
						<div class="card">
							<span>{s.title} · {m.name} · {s.bo(m)}</span>
							{#each [m.pa, m.pb] as p}<button onclick={() => pick(s, m, p)}>{s.pool.players[p]}</button>{/each}
						</div>
					{/each}
				</div>
			{/if}
			{#if poolsDone && !bracket.top}<button class="btn btn--solid" onclick={startTop}>Start top cut →</button>{/if}

			{#each [...list].reverse() as stage (stage.key)}
				<div class="stage">
					<h2>{stage.title}</h2>
					<Bracket {stage} onpick={(m, p) => pick(stage, m, p)} />
				</div>
			{/each}

			<div class="danger">
				{#if bracket.top}<button onclick={() => reset(true)}>Back to pools</button>{/if}
				<button onclick={() => reset(false)}>Delete bracket</button>
			</div>
		{/if}
	</div>
</main>

<style>
	.admin { min-height: 100vh; background: linear-gradient(100deg, var(--red-hot) 0%, var(--red) 60%, var(--red-deep) 100%); }
	.wrap { max-width: 1200px; }
	.back { display: inline-block; margin-bottom: 18px; font-family: var(--mono); font-weight: 700; }
	.section-title { font-size: clamp(44px, 10vw, 80px); }
	h2 { font-size: 28px; margin: 28px 0 12px; }
	.status { font-family: var(--mono); font-weight: 700; margin-top: 10px; }
	.note { font-family: var(--mono); margin-top: 20px; }
	.table-wrap { margin-top: 12px; overflow-x: auto; background: var(--white); border-radius: 8px; }
	table { width: 100%; border-collapse: collapse; color: var(--ink); font-size: 15px; }
	th, td { text-align: left; padding: 10px 12px 8px; border-bottom: 1px solid #eadfe1; white-space: nowrap; }
	th { font-family: var(--mono); font-size: 12px; text-transform: uppercase; background: var(--ink); color: var(--white); }
	tr.off td { opacity: .45; }
	td input { width: 20px; height: 20px; accent-color: var(--red); }
	.setup { display: flex; flex-wrap: wrap; gap: 14px; align-items: end; margin-top: 20px; }
	.setup p { font-family: var(--mono); font-weight: 700; padding-bottom: 12px; }
	label { display: grid; gap: 6px; font-weight: 800; text-transform: uppercase; font-size: 15px; }
	label input, select { font-family: var(--mono); font-size: 16px; padding: 12px 14px; border-radius: 5px; border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); color: var(--white); width: 140px; }
	option { color: var(--ink); }
	.btn { cursor: pointer; font-size: 18px; margin-top: 20px; }
	.setup .btn { margin-top: 0; }
	.btn:disabled { opacity: .6; cursor: default; }
	.next { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
	.card { display: grid; gap: 6px; background: var(--white); color: var(--ink); border-radius: 8px; padding: 10px; }
	.card span { font-family: var(--mono); font-size: 12px; text-transform: uppercase; color: #5d4449; }
	.card button { font-family: var(--display); font-weight: 800; font-size: 17px; text-align: left; padding: 8px 10px 6px; border-radius: 5px; border: 2px solid #e5d6d9; background: var(--white); color: var(--ink); cursor: pointer; }
	.card button:hover { border-color: var(--red); background: var(--red); color: var(--white); }
	.stage { background: var(--cream); color: var(--ink); border-radius: var(--radius); padding: 4px 16px 16px; margin-top: 20px; }
	.stage h2 { color: var(--red); }
	.danger { display: flex; gap: 16px; margin-top: 28px; }
	.danger button { background: none; border: none; color: var(--white); font-family: var(--mono); text-decoration: underline; cursor: pointer; padding: 0; }
</style>
