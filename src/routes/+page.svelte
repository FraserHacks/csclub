<script>
	import { onMount } from 'svelte';
	import qr from '#lib/join_qr.svg?raw';
	import {
		SITE_URL,
		CLASSROOM_CODE,
		TYPES,
		projects,
		carousel,
		boothTrinkets,
		prizes,
		trinketGroups
	} from '#lib/data.js';

	let { data } = $props();

	const TITLE = 'Fraser Comp Sci Club';
	const DESCRIPTION =
		'Build cool things, win prizes, compete, and take home a 3D printed trinket every meeting.';

	let filter = $state('all');
	let query = $state('');
	const tabs = [
		['all', 'All'],
		['hw', 'Hardware'],
		['sw', 'Software']
	];

	const shown = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return projects.filter(
			(p) =>
				(filter === 'all' || p.type === filter || p.type === 'both') &&
				(!q || [p.name, p.desc, p.by].some((s) => s.toLowerCase().includes(q)))
		);
	});

	const initials = (name) =>
		name
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();

	const projectName = (url) => {
		const p = projects.find((p) => p.href.toLowerCase() === url.toLowerCase());
		return p ? (p.short ?? p.name) : url.replace(/\/+$/, '').split('/').pop();
	};

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: TITLE,
		alternateName: 'FCS Club',
		url: `${SITE_URL}/`,
		logo: `${SITE_URL}/assets/logo.png`,
		description: DESCRIPTION,
		parentOrganization: { '@type': 'HighSchool', name: 'John Fraser Secondary School' }
	});

	let vp, track;

	onMount(() => {
		const items = [...track.children];
		const n = items.length / 3;
		let i = n;

		function place(animate) {
			track.classList.toggle('no-anim', !animate);
			const el = items[i];
			const x = vp.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
			track.style.transform = `translateX(${x}px)`;
			items.forEach((it, k) => it.classList.toggle('active', k === i));
			if (!animate) {
				track.offsetHeight;
				track.classList.remove('no-anim');
			}
		}

		const onResize = () => place(false);
		place(false);
		addEventListener('resize', onResize);
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return () => removeEventListener('resize', onResize);
		}

		const timer = setInterval(() => {
			i++;
			place(true);
			if (i >= 2 * n) setTimeout(() => { i -= n; place(false); }, 750);
		}, 2600);

		return () => {
			clearInterval(timer);
			removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION}>
	<link rel="canonical" href="{SITE_URL}/">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content={TITLE}>
	<meta property="og:title" content={TITLE}>
	<meta property="og:description" content={DESCRIPTION}>
	<meta property="og:url" content="{SITE_URL}/">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="preload" as="image" href="/assets/logo.webp" fetchpriority="high">
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<main id="top">

<section class="booth halftone">
	<div class="booth-side-word outline-word" aria-hidden="true">FCSFCSFCSFCS</div>
	<img class="sparkles" src="/assets/deco/sparkles.webp" alt="" aria-hidden="true">

	<div class="hook">
		<div class="brand-row">
			<img src="/assets/logo.webp" alt="Fraser Comp Sci Club logo" fetchpriority="high">
			<h1 class="title">
				<span class="l1"><span class="echo" data-echo="Fraser">Fraser</span></span>
				<span class="l2"><span class="echo" data-echo="Comp Sci Club">Comp Sci Club</span></span>
			</h1>
		</div>

		<div class="scroll-block">
			<div class="marquee trinket-marquee" aria-label="Trinkets"><div class="track">{#each [0, 1] as copy}{#each boothTrinkets as [img, name]}<figure aria-hidden={copy ? 'true' : undefined}><img src="/assets/icons/{img}.webp" alt=""><figcaption>{name}</figcaption></figure>{/each}{/each}</div></div>
			<h2>Free trinket <span>every meeting!!</span></h2>
		</div>

		<div class="join">
			<a class="qr" href="/join" aria-label="Join the club">{@html qr}</a>
			<div>
				<b>Scan to join!</b>
				<div class="join-actions">
					<a class="members-btn" href="#members">Meet the members ↓</a>
					<a class="class-code" href="/join" aria-label="Google Classroom code {CLASSROOM_CODE}">{CLASSROOM_CODE}</a>
				</div>
			</div>
		</div>

		<div class="scroll-block">
			<div class="prize-row" aria-label="Prizes">{#each prizes as [img, alt]}<figure><img src="/assets/icons/{img}.webp" {alt}></figure>{/each}</div>
			<h2>Win prizes!</h2>
		</div>
	</div>

	<div class="reasons">
		<div class="club-info">
			<p class="tagline">Build cool stuff!!<br><span>Win prizes!</span><br>Get ECs!</p>
			<p class="when"><b>Thursdays</b> · <b>Lunch</b> · Rm TBD</p>
		</div>

		<div class="reason">
			<h2>Compete for <span>medals + scholarships!</span></h2>
			<ul class="comp-three">
				<li><a class="ext" href="https://cemc.uwaterloo.ca/contests/ccc" target="_blank" rel="noopener"><b>CCC</b><span>hosted by Waterloo</span></a></li>
				<li><a class="ext" href="https://www.peelsciencefair.ca/" target="_blank" rel="noopener"><b>Peel Science Fair</b><span>→ CWSF → ISEF</span></a></li>
				<li><a class="ext" href="https://www.peelschools.org/peel-skills-challenge" target="_blank" rel="noopener"><b>Peel Skills</b><span>→ Ontario → Canada</span></a></li>
			</ul>
		</div>

		<div class="proj-carousel">
			<div class="pc-viewport" bind:this={vp}><div class="pc-track" bind:this={track}>{#each [0, 1, 2] as copy}{#each carousel as p}<a class="pc-item" href={p.href} target="_blank" rel="noopener" aria-hidden={copy !== 1 ? 'true' : undefined} tabindex={copy !== 1 ? -1 : undefined}><div class="frame"><img src="/assets/projects/{p.img}.webp" alt=""></div><span class="pc-name">{p.short ?? p.name}<small>by {p.by}</small></span></a>{/each}{/each}</div></div>
			<a class="built-by" href="#projects">Built by JFSS students!! ↓</a>
		</div>
	</div>
</section>

<section class="section projects" id="projects">
	<div class="outline-word side-word" aria-hidden="true">BUILD</div>
	<div class="wrap">
		<h2 class="section-title"><span class="echo" data-echo="Project directory">Project directory</span></h2>
		<p class="section-lede">Hardware and software built by JFSS students. Make something and it goes up here.</p>

		<div class="proj-group">
			<div class="proj-group-head">
				<h3>Beginner projects</h3>
				<p>Start here. We build these at meetings.</p>
			</div>
			<div class="proj-grid">
				<article class="proj">
					<div class="proj-img proj-img--shot"><img src="/assets/projects/led-heart.webp" alt="Red LEDs arranged in a heart on a board" loading="lazy"></div>
					<div class="proj-body">
						<h3>LED breadboard heart</h3>
						<p>Wire up LEDs and resistors into a heart. Your first circuit.</p>
						<div class="proj-meta"><span>meeting 1</span><span class="tag tag--hw">Hardware</span></div>
					</div>
				</article>
				<article class="proj">
					<div class="proj-img proj-img--cut bg-cyan"><img src="/assets/projects/personal-site.webp" alt="A website shown on a tablet, laptop and phone" loading="lazy"></div>
					<div class="proj-body">
						<h3>Personal site</h3>
						<p>Build and publish your own website with HTML and CSS.</p>
						<div class="proj-meta"><span>workshop</span><span class="tag tag--sw">Software</span></div>
					</div>
				</article>
			</div>
		</div>

		<div class="proj-bar">
			<div class="tabs" role="group" aria-label="Filter projects">
				{#each tabs as [value, label]}
					<button class="tab" aria-pressed={filter === value} onclick={() => (filter = value)}>{label}</button>
				{/each}
			</div>
			<input class="search" type="search" placeholder="search projects..." aria-label="Search projects" bind:value={query}>
		</div>

		<div class="proj-grid">
			{#each shown as p (p.img)}
				<a class="proj" href={p.href} target="_blank" rel="noopener" data-type={p.type}>
					<div class="proj-img proj-img--{p.frame}"><img src="/assets/projects/{p.img}.webp" alt={p.name} loading="lazy"></div>
					<div class="proj-body">
						<h3>{p.name}</h3>
						<p>{p.desc}</p>
						<div class="proj-meta"><span>by {p.by}</span><span class="tag {TYPES[p.type].tag}">{TYPES[p.type].label}</span></div>
					</div>
				</a>
			{/each}
			<article class="proj proj--empty">
				<span class="plus">+</span>
				<h3>Your project!!</h3>
				<p>Build something and it goes here.</p>
			</article>
		</div>
	</div>
</section>

<section class="section members halftone" id="members">
	<div class="wrap">
		<h2 class="section-title"><span class="echo" data-echo="Member directory">Member directory</span></h2>
		<p class="section-lede">Everyone in the club and what they've built!</p>

		<div class="m-grid">
			{#each data.members as m}
				<div class="m-row">
					<span class="av">{initials(m.name)}</span>
					<div class="m-name"><b>{m.name}</b><span class="role {m.exec ? 'role--exec' : 'role--member'}">{m.role}</span></div>
					<div class="m-projects">
						{#each m.projects as url}<a href={url} target="_blank" rel="noopener">{projectName(url)}</a>{:else}<span class="none">first project coming soon!</span>{/each}
					</div>
					{#if m.github}<a class="m-gh" href="https://github.com/{m.github}" target="_blank" rel="noopener">@{m.github}</a>{/if}
				</div>
			{/each}
			<a class="m-row m-row--you" href="/join">
				<span class="av">+</span>
				<div class="m-name"><b>You?!</b><span class="role">join on Thursday</span></div>
				<div class="m-projects"><span class="none">build something and it shows up here</span></div>
			</a>
		</div>
	</div>
</section>

<section class="section gallery halftone">
	<img src="/assets/deco/cat-hoodie.webp" alt="" aria-hidden="true" loading="lazy" style="position:absolute;right:-30px;top:20px;width:240px;opacity:.9">
	<div class="wrap">
		<h2 class="section-title"><span class="echo" data-echo="Free trinkets!!">Free trinkets!!</span></h2>
		<p class="section-lede">Sign up and pick a 3D printed keychain! New designs every meeting. Got an idea? Tell an exec and we might print it!!</p>

		{#each trinketGroups as group}
			<div class="gal-group">
				<h3>{group.title}</h3>
				<div class="gal">
					{#each group.items as [img, name, sub, white]}
						<figure><img src="/assets/trinkets/{img}.webp" alt={name} loading="lazy" style={white ? 'background:#fff;object-fit:contain' : undefined}><figcaption>{name}<small>{sub}</small></figcaption></figure>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="section more">
	<div class="wrap">
		<h2 class="section-title"><span class="echo" data-echo="First meetings!">First meetings!</span></h2>
		<div class="idea-grid">
			<div class="idea"><b>01 · LED heart breadboard</b><span>Your first circuit, as a speed build. Fastest build wins a $10 Tims card!</span></div>
			<div class="idea"><b>02 · Smash / Mario Kart tourney</b><span>Easy entry, bracket style. Prize for the winner!!</span></div>
			<div class="idea"><b>03 · LED coin cell keychain</b><span>Learn to solder and design your own case.</span></div>
		</div>

		<h2 class="board-title" style="margin-top:56px"><span class="echo" data-echo="Competitions">Competitions</span></h2>
		<div class="ladders ladders--page">
			<div class="ladder"><div class="path"><b><a class="ext" href="https://cemc.uwaterloo.ca/contests/ccc" target="_blank" rel="noopener">CCC</a></b><i>→</i><span><a class="ext" href="https://cemc.uwaterloo.ca/contests/ccc" target="_blank" rel="noopener">CCO</a></span><i>→</i><span><a class="ext" href="https://ioinformatics.org/" target="_blank" rel="noopener">IOI</a></span></div><p>Certificate of Distinction for the top 25%. Top ~20 in Canada go to the CCO.</p></div>
			<div class="ladder"><div class="path"><b><a class="ext" href="https://www.peelsciencefair.ca/" target="_blank" rel="noopener">Peel Science Fair</a></b><i>→</i><span><a class="ext" href="https://youthscience.ca/science-fairs/cwsf/" target="_blank" rel="noopener">CWSF</a></span><i>→</i><span><a class="ext" href="https://www.societyforscience.org/isef/" target="_blank" rel="noopener">ISEF</a></span></div><p>CWSF medals and ~$2M in prizes + scholarships. ISEF gives out $7M+.</p></div>
			<div class="ladder"><div class="path"><b><a class="ext" href="https://www.peelschools.org/peel-skills-challenge" target="_blank" rel="noopener">Peel Skills</a></b><i>→</i><span><a class="ext" href="https://www.skillsontario.com/" target="_blank" rel="noopener">Skills Ontario</a></span><i>→</i><span><a class="ext" href="https://www.skillscompetencescanada.com/" target="_blank" rel="noopener">Skills Canada</a></span></div><p>Gold, silver and bronze medals, plus $1,000 Skills Ontario scholarships.</p></div>
			<div class="ladder ladder--red"><div class="path"><b><a class="ext" href="https://www.fraserhacks.dev/" target="_blank" rel="noopener">FraserHacks</a></b></div><p>Our own hackathon. Prizes for the winning teams.</p></div>
		</div>

		<h2 class="board-title" style="margin-top:56px"><span class="echo" data-echo="Also coming up!">Also coming up!</span></h2>
		<div class="idea-grid">
			<div class="idea"><b>Breadboard IC speed build</b><span>A small chip circuit like gr 11 comp tech, raced against the clock.</span></div>
			<div class="idea"><b>LED macropad keychain</b><span>A tiny macropad that lives on your keys.</span></div>
			<div class="idea"><b>Beginner PCB design</b><span>Design a hacker card with NFC, an LED chaser, and more.</span></div>
			<div class="idea"><b>Boba workshop</b><span>Build something with Hack Club, get boba.</span></div>
			<div class="idea"><b>Paper circuit cards</b><span>Copper tape, an LED and a coin cell on a heart-shaped card.</span></div>
			<div class="idea"><b>Project demo days</b><span>Show off your personal project to the club.</span></div>
			<div class="idea"><b>FraserHacks prep</b><span>How to actually succeed at a hackathon.</span></div>
			<div class="idea"><b>CCC practice</b><span>Past problems, worked through together.</span></div>
		</div>

		<h3 style="margin-top:28px;font-size:26px;color:var(--ink)">More competitions</h3>
		<div class="idea-grid">
			<a class="idea ext" href="https://www.mlh.com/seasons/2027/events" target="_blank" rel="noopener"><b>Local hackathons</b><span>Weekend build sprints around the GTA. We go as a group.</span></a>
			<a class="idea ext" href="https://hackthenorth.com/" target="_blank" rel="noopener"><b>Hack the North</b><span>Canada's biggest hackathon, at Waterloo.</span></a>
			<a class="idea ext" href="https://www.jamhacks.ca/" target="_blank" rel="noopener"><b>JAMHacks</b><span>High school hackathon in Waterloo!</span></a>
			<a class="idea ext" href="https://hackthe6ix.com/" target="_blank" rel="noopener"><b>Hack the 6ix</b><span>Toronto's summer hackathon.</span></a>
			<a class="idea ext" href="https://www.deltahacks.com/" target="_blank" rel="noopener"><b>DeltaHacks</b><span>McMaster's hackathon in Hamilton.</span></a>
			<a class="idea ext" href="https://www.hackwestern.com/" target="_blank" rel="noopener"><b>Hack Western</b><span>Western University, London ON.</span></a>
			<a class="idea ext" href="https://www.uottahack.ca/" target="_blank" rel="noopener"><b>uOttaHack</b><span>University of Ottawa's hackathon.</span></a>
			<a class="idea ext" href="https://www.ignitionhacks.org/" target="_blank" rel="noopener"><b>Ignition Hacks</b><span>Online hackathon for high schoolers!</span></a>
			<a class="idea ext" href="https://hiskule.skule.ca/" target="_blank" rel="noopener"><b>U of T HS Design</b><span>Engineering design challenge run by U of T.</span></a>
			<a class="idea ext" href="https://engineering.ontariotechu.ca/outreach/teacher-programs/robotics_competition/index.php" target="_blank" rel="noopener"><b>Ontario Tech Robotics</b><span>Build and run a robot against other schools.</span></a>
			<a class="idea ext" href="https://www.mechmania.ca/" target="_blank" rel="noopener"><b>Waterloo MechMania</b><span>Programming competition.</span></a>
			<a class="idea ext" href="https://www.congressionalappchallenge.us/" target="_blank" rel="noopener"><b>Congressional App Challenge</b><span>Build an app, get judged.</span></a>
			<a class="idea ext" href="https://www.samsung.com/ca/solvefortomorrow/" target="_blank" rel="noopener"><b>Samsung Solve for Tomorrow</b><span>Use tech to solve a problem in your community.</span></a>
		</div>

		<div class="uni">
			<div>
				<h3>University <span>advice panel</span></h3>
				<p style="margin-top:10px;font-size:16px;opacity:.85">Alumni and older students talk programs, applications, and what they wish they knew.</p>
			</div>
			<ul>
				<li>Shopify Dev Degree</li>
				<li>Math / BBA</li>
				<li>Mechatronics</li>
				<li>CS, engineering + more</li>
			</ul>
		</div>

		<h2 class="board-title"><span class="echo" data-echo="What would you build?!">What would you build?!</span></h2>
		<div class="notes">
			<div class="note">a robot that brings me snacks</div>
			<div class="note">rhythm game but you play it with a guitar</div>
			<div class="note">a website that tells me when the caf has fries</div>
			<div class="note">custom mechanical keyboard</div>
			<div class="note">drone!!!</div>
			<div class="note note--add">+ What would <b>you</b> build?<br>Let us know!!</div>
		</div>
	</div>
</section>

</main>

<footer>
	<div class="wrap">
		<a class="brand" href="#top"><img src="/assets/logo_small.webp" alt="" width="40" height="40" loading="lazy"><span>Fraser Comp Sci Club</span></a>
		<span>Made by <a href="https://github.com/darshg321" target="_blank" rel="noopener">Darsh</a></span>
	</div>
</footer>
