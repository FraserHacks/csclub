function seedOrder(size) {
	let order = [0];
	while (order.length < size) order = order.flatMap((s) => [s, order.length * 2 - 1 - s]);
	return order;
}

const pairs = (list) => Array.from({ length: list.length / 2 }, (_, i) => [list[2 * i], list[2 * i + 1]]);

// Double elimination for n players. With cut, play stops when cut players are left (cut/2 per side).
export function build(n, cut = 0) {
	const size = 2 ** Math.max(1, Math.ceil(Math.log2(Math.max(n, 2))));
	const rounds = Math.log2(size);
	if (cut && cut >= size) return { matches: [], advance: Array.from({ length: n }, (_, p) => ({ p })) };

	const wRounds = cut ? rounds - Math.log2(cut) + 1 : rounds;
	const lRounds = cut ? 2 * (rounds - Math.log2(cut)) : 2 * (rounds - 1);
	const matches = [];
	const add = (bracket, round, name, list) =>
		list.map(([a, b], i) => {
			const id = `${bracket}${round}-${i + 1}`;
			matches.push({ id, bracket, round, name, a, b });
			return id;
		});

	let w = seedOrder(size).map((s) => ({ p: s < n ? s : null }));
	const wLosers = [];
	for (let r = 1; r <= wRounds; r++) {
		const ids = add('W', r, r === rounds ? 'Winners final' : `Winners ${r}`, pairs(w));
		wLosers.push(ids.map((id) => ({ l: id })));
		w = ids.map((id) => ({ w: id }));
	}

	let l = wLosers[0];
	for (let r = 1; r <= lRounds; r++) {
		let list;
		if (r === 1) list = pairs(l);
		else if (r % 2 === 0) {
			const drop = (r / 2) % 2 ? [...wLosers[r / 2]].reverse() : wLosers[r / 2];
			list = l.map((s, i) => [s, drop[i]]);
		} else list = pairs(l);
		l = add('L', r, r === 2 * (rounds - 1) ? 'Losers final' : `Losers ${r}`, list).map((id) => ({ w: id }));
	}

	if (cut) return { matches, advance: [...w, ...l] };
	add('G', 1, 'Grand final', [[w[0], l[0]]]);
	add('G', 2, 'Reset', [[{ w: 'G1-1' }, { l: 'G1-1' }]]);
	matches.at(-1).reset = true;
	return { matches, advance: [{ w: 'G2-1' }] };
}

// pa/pb/winner/loser: player index, null for a bye, undefined while still to be decided
export function resolve({ matches, advance }, winners = {}) {
	const out = {};
	const get = (s) => ('p' in s ? s.p : 'w' in s ? out[s.w].winner : out[s.l].loser);
	for (const m of matches) {
		const r = { ...m, pa: get(m.a), pb: get(m.b) };
		const gf = out['G1-1'];
		if (m.reset && gf.winner !== undefined && gf.winner === gf.pa) Object.assign(r, { skip: true, winner: gf.winner });
		else if (r.pa === null) Object.assign(r, { winner: r.pb, loser: null });
		else if (r.pb === null) Object.assign(r, { winner: r.pa, loser: null });
		else if (r.pa !== undefined && r.pb !== undefined && [r.pa, r.pb].includes(winners[m.id]))
			Object.assign(r, { winner: winners[m.id], loser: winners[m.id] === r.pa ? r.pb : r.pa });
		out[m.id] = r;
	}
	return { matches: matches.map((m) => out[m.id]), advance: advance.map(get) };
}

export const ready = (m) => !m.skip && m.winner === undefined && m.pa != null && m.pb != null;

export function stages(bracket) {
	if (!bracket) return [];
	const list = bracket.pools.map((pool, i) => ({
		key: `pool${i}`,
		title: `Pool ${String.fromCharCode(65 + i)}`,
		bo: () => 'Bo1',
		pool,
		...resolve(build(pool.players.length, bracket.advance), pool.winners)
	}));
	if (bracket.top) list.push({
		key: 'top',
		title: `Top ${bracket.top.players.length}`,
		bo: (m) => (m.bracket === 'G' ? 'Bo5' : 'Bo3'),
		pool: bracket.top,
		...resolve(build(bracket.top.players.length), bracket.top.winners)
	});
	return list;
}
