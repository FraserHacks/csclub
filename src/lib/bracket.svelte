<script>
	let { stage, onpick } = $props();

	const rows = $derived.by(() => {
		const shown = stage.matches.filter((m) => !m.skip && m.pa !== null && m.pb !== null);
		const columns = (brackets) => {
			const map = new Map();
			for (const m of shown.filter((m) => brackets.includes(m.bracket))) {
				const key = m.bracket + m.round;
				if (!map.has(key)) map.set(key, { name: m.name, matches: [] });
				map.get(key).matches.push(m);
			}
			return [...map.values()];
		};
		return [columns(['W', 'G']), columns(['L'])].filter((r) => r.length);
	});
	const name = (p) => (p === undefined ? 'TBD' : stage.pool.players[p]);
</script>

{#each rows as columns}
	<div class="row">
		{#each columns as col}
			<div class="col">
				<span class="round">{col.name} · {stage.bo(col.matches[0])}</span>
				{#each col.matches as m (m.id)}
					<div class="match">
						{#each [m.pa, m.pb] as p}
							{#if onpick && m.pa !== undefined && m.pb !== undefined}
								<button class:won={m.winner === p} class:lost={m.winner !== undefined && m.winner !== p} onclick={() => onpick(m, p)}>{name(p)}</button>
							{:else}
								<span class:won={m.winner !== undefined && m.winner === p} class:lost={m.winner !== undefined && m.winner !== p} class:tbd={p === undefined}>{name(p)}</span>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/each}

<style>
	.row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 10px; }
	.row + .row { margin-top: 14px; border-top: 2px dashed #e5d6d9; padding-top: 14px; }
	.col { display: flex; flex-direction: column; justify-content: space-around; gap: 10px; flex: none; width: 170px; }
	.round { font-family: var(--mono); font-size: 12px; font-weight: 700; text-transform: uppercase; color: #5d4449; }
	.match { display: grid; background: var(--white); border: 2px solid #e5d6d9; border-radius: 6px; overflow: hidden; }
	.match > * { font-family: var(--display); font-size: 16px; font-weight: 700; text-align: left; padding: 7px 10px 5px; color: var(--ink); background: none; border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.match > * + * { border-top: 1px solid #e5d6d9; }
	button { cursor: pointer; }
	button:hover { background: #fbeef0; }
	.won { background: var(--red); color: var(--white); }
	button.won:hover { background: var(--red-deep); }
	.lost { opacity: .45; text-decoration: line-through; }
	.tbd { color: #a8999c; font-weight: 400; }
</style>
