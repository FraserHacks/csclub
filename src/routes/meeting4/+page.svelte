<script>
	import { SITE_URL } from '#lib/data.js';

	const DESCRIPTION = 'Meeting 4: personal site workshop. Write your own website in HTML and CSS and put it online for free with GitHub Pages.';

	let { data } = $props();

	const page = (style, body) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Name</title>${style ? `\n  <style>\n${style}\n  </style>` : ''}
</head>
<body>
${body}
</body>
</html>`;

	const about = `  <h1>Hi, I'm Your Name!</h1>
  <p>Grade 10 at John Fraser. I like building robots and drawing.</p>

  <h2>Stuff I like</h2>
  <ul>
    <li>Smash Ultimate</li>
    <li>3D printing</li>
    <li>Cinnamoroll</li>
  </ul>

  <h2>Find me</h2>
  <a href="https://github.com/yourname">GitHub</a>
  <a href="mailto:you@example.com">Email</a>`;

	const style = `    body {
      max-width: 640px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: system-ui, sans-serif;
      background: #fff5f7;
      color: #2a1a1e;
    }
    h1 { font-size: 48px; color: #ec3750; }
    a { color: #ec3750; margin-right: 12px; }`;

	const cards = `
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .card {
      display: block;
      margin: 0;
      padding: 16px;
      border: 3px solid #2a1a1e;
      border-radius: 10px;
      background: white;
      color: inherit;
      text-decoration: none;
    }
    .card:hover { box-shadow: 4px 4px 0 #2a1a1e; }`;

	const projectsHtml = `

  <h2>Projects</h2>
  <div class="projects">
    <a class="card" href="https://github.com/yourname/led-heart">
      <b>LED heart</b>
      <p>My first circuit, built at CS club.</p>
    </a>
    <a class="card" href="https://github.com/yourname/fan">
      <b>Arduino fan</b>
      <p>A fan you control with a knob.</p>
    </a>
  </div>`;

	const steps = [
		{
			id: 'setup',
			title: 'Setup',
			about: 'GitHub Pages hosts your site for free. Your link will be yourusername.github.io.',
			steps: [
				'Make an account at github.com. Use your personal email so you keep it after you graduate.',
				'Top right + → New repository. Name it exactly yourusername.github.io. Public. Create.',
				'Click "creating a new file". Name it index.html, paste the code, then Commit changes.',
				'Wait a minute and open yourusername.github.io. Your site is live!',
				'Still a 404? Settings → Pages → Branch: main → Save, then wait another minute.'
			],
			code: page('', `  <h1>Hi, I'm Your Name!</h1>`)
		},
		{
			id: 'html',
			title: 'HTML',
			about: 'HTML is the content. Headings, paragraphs, lists and links. Make it about you!',
			steps: [
				'<h1> is the big title. <h2> is a smaller heading.',
				'<p> is a paragraph. <ul> is a list, with one <li> per item.',
				'<a href="..."> is a link. Point yours at your GitHub, Instagram or email.',
				'Swap in your own name and stuff, then commit.'
			],
			code: page('', about)
		},
		{
			id: 'css',
			title: 'CSS',
			about: 'CSS is the looks. Each rule picks some tags, then sets colours, sizes and spacing.',
			steps: [
				'Everything goes in the <style> tag inside <head>.',
				'body { } styles the whole page. h1 { } styles every <h1>.',
				'Change the colours. Any hex code works, like #5bc0de.',
				'max-width keeps text from stretching across huge screens.'
			],
			code: page(style, about)
		},
		{
			id: 'projects',
			title: 'Projects',
			about: 'Show off what you built. This is the part that goes on your resume and uni apps.',
			steps: [
				'Each project is a card. The class="card" is how the CSS finds it.',
				'grid lays the cards out side by side, and wraps them on phones.',
				'Copy a card for each thing you\'ve built. Club builds count!',
				'Link each card to the project\'s GitHub, a video or a photo.'
			],
			code: page(style + cards, about + projectsHtml)
		}
	];

	const challenges = [
		['Easy', 'Add a photo', 'Add file → Upload files, then show it with <img src="me.jpg">.'],
		['Easy', 'Your colours', 'Pick a palette on coolors.co and restyle everything.'],
		['Medium', 'Dark mode', 'Switch colours when the phone is in dark mode. Hint: prefers-color-scheme.'],
		['Medium', 'Second page', 'Make projects.html and link the two pages together.'],
		['Hard', 'Make it move', 'Add a <script> that does something when you click. Confetti? A theme switcher?'],
		['Boss', 'Terminal', 'Make your site look and work like a command line. Typing help lists your pages.']
	];

	const upload = [
		['gh_new', 'Top right + → New repository. Name it yourusername.github.io, keep it Public, then Create repository.'],
		['gh_editor', 'Click "creating a new file". Name it index.html, paste your code, then Commit changes...'],
		['gh_commit', 'Hit Commit changes again to save it.'],
		['gh_pages', 'Settings → Pages shows your link after a minute. Still a 404? Set Branch to main and Save.'],
		['gh_blob', 'To update: open index.html, click the ✎ pencil, paste your new code and commit.']
	];

	let active = $state('setup');
	let edits = $state({});
	let copied = $state(false);
	const step = $derived(steps.find((s) => s.id === active));
	const code = $derived(edits[active] ?? step.code);

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Meeting 4: Personal site | Fraser Comp Sci Club</title>
	<meta name="description" content={DESCRIPTION}>
	<link rel="canonical" href="{SITE_URL}/meeting4">
	<meta property="og:title" content="Meeting 4: Personal site | Fraser Comp Sci Club">
	<meta property="og:description" content={DESCRIPTION}>
	<meta property="og:url" content="{SITE_URL}/meeting4">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
</svelte:head>

<div class="bar">
	<a class="brand" href="/#meetings"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club" width="36" height="36"><span>Meeting 04</span></a>
	<a class="jump" href="#challenges">Challenges</a>
</div>

<main>
	<header class="section halftone">
		<div class="wrap">
			<span class="label">Thu Nov 12 · 11:05 AM · Rm 183 · Open meeting, no sign up needed</span>
			<h1 class="section-title"><span class="echo" data-echo="Your own site!!">Your own site!!</span></h1>
			<p class="section-lede">Build a website about you and put it online for free. <b>Bring a laptop. Leave with a link for your resume and uni apps.</b></p>
		</div>
	</header>

	<div class="guide">
		<section class="row">
			<div class="text">
				<h2>What's a website?</h2>
				<p>Just a text file called <b>index.html</b>. Your browser downloads it and draws it.</p>
				<ul>
					<li><b>HTML:</b> what's on the page. Words, links, pictures.</li>
					<li><b>CSS:</b> how it looks. Colours, fonts, layout.</li>
					<li><b>Tags</b> wrap your content. Most come in pairs: an opening tag and a closing tag with a /.</li>
				</ul>
			</div>
			<div class="media">
				<div class="anatomy" aria-label="Parts of an HTML tag">
					<code><span class="t-open">&lt;a <span class="t-attr">href="https://github.com"</span>&gt;</span><span class="t-text">GitHub</span><span class="t-close">&lt;/a&gt;</span></code>
					<ul>
						<li><i class="t-open"></i>Opening tag</li>
						<li><i class="t-attr"></i>Attribute: extra info, like where a link goes</li>
						<li><i class="t-text"></i>Content: what you see</li>
						<li><i class="t-close"></i>Closing tag</li>
					</ul>
				</div>
			</div>
		</section>

		<section class="row warn">
			<div class="text">
				<h2>It's public!!</h2>
				<ul>
					<li><b>Anyone can see it.</b> No home address, phone number or class schedule.</li>
					<li><b>Every update:</b> open index.html on GitHub → ✎ pencil → paste → Commit changes. Refresh after a minute.</li>
					<li><b>Try it here first.</b> Edit the code below and the preview updates live.</li>
				</ul>
			</div>
		</section>

		<section class="lab" id="steps">
			<div class="tabs" role="tablist">
				{#each steps as s, i (s.id)}
					<button role="tab" aria-selected={active === s.id} class:on={active === s.id} onclick={() => (active = s.id)}>
						<small>{String(i + 1).padStart(2, '0')}</small>{s.title}
					</button>
				{/each}
			</div>

			<div class="project" role="tabpanel">
				<div class="text">
					<h2>{step.title}</h2>
					<p>{step.about}</p>
					<ol>
						{#each step.steps as s}<li>{s}</li>{/each}
					</ol>
				</div>
				<div class="code-wrap">
					<div class="code-actions">
						{#if edits[active] !== undefined}<button onclick={() => delete edits[active]}>Reset</button>{/if}
						<button onclick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
					</div>
					<textarea class="code" spellcheck="false" aria-label="index.html" value={code} oninput={(e) => (edits[active] = e.currentTarget.value)}></textarea>
				</div>
				<div class="preview">
					<span class="url">yourusername.github.io</span>
					<iframe title="Preview" srcdoc={code} sandbox="allow-scripts"></iframe>
				</div>
			</div>
		</section>

		<section class="upload" id="upload">
			<h2>Put it online</h2>
			<p class="lede">Code ready? Here's every click on GitHub.</p>
			<ol class="shots">
				{#each upload as [img, text], i}
					<li><img src="/assets/meetings/4/{img}.webp" alt="GitHub step {i + 1}" loading="lazy"><p><b>{String(i + 1).padStart(2, '0')}</b>{text}</p></li>
				{/each}
			</ol>
		</section>

		<section class="challenges" id="challenges">
			<h2>Challenges</h2>
			<p class="lede">Site's up? Make it better. No code given. Show an exec when yours works!</p>
			<div class="grid">
				{#each challenges as [tier, title, text]}
					<div class="challenge">
						<span class="tier tier--{tier.toLowerCase()}">{tier}</span>
						<b>{title}</b>
						<p>{text}</p>
					</div>
				{/each}
			</div>
		</section>

		{#if data.builds.length}
			<section class="builds">
				<h2>Everyone's sites!!</h2>
				<div class="build-grid">
					{#each data.builds as b (b.id)}
						<figure><img src={b.src} alt={b.name} loading="lazy"><figcaption>{b.name}<small>by {b.by}</small></figcaption></figure>
					{/each}
				</div>
			</section>
		{/if}

		<a class="btn back" href="/#meetings">← All meetings</a>
	</div>
</main>

<style>
	.bar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px var(--gutter); background: var(--ink); box-shadow: 0 4px 0 var(--cyan-deep); }
	.bar .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 800; text-transform: uppercase; }
	.bar .brand img { width: 36px; }
	.jump { font-weight: 800; text-transform: uppercase; font-size: 14px; padding: 8px 12px 5px; border-radius: 5px; background: var(--white); color: var(--ink); text-decoration: none; }

	header { background: linear-gradient(100deg, var(--cyan) 0%, var(--cyan-deep) 100%); padding: clamp(40px, 6vw, 72px) 0; }
	header .label { display: block; margin-bottom: 10px; font-size: 14px; }
	.section-lede b { background: var(--ink); padding: 0 5px; }

	.guide { background: var(--cream); color: var(--ink); padding: clamp(32px, 4vw, 56px) var(--gutter) 48px; }
	.row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; padding: clamp(20px, 3vw, 36px) 0; }
	h2 { font-size: clamp(34px, 4vw, 52px); color: var(--cyan-deep); margin-bottom: 16px; }
	.text p, .text li { font-size: 18px; line-height: 1.45; color: #3e4650; }
	.text b { color: var(--ink); }
	.text ul, .text ol { margin: 12px 0 0; padding-left: 22px; display: grid; gap: 8px; }
	.warn { display: block; background: var(--white); border-radius: var(--radius); padding: 20px clamp(20px, 3vw, 40px); border: 3px solid var(--red); margin: 12px auto 32px; }
	.warn h2 { color: var(--red); font-size: clamp(28px, 3vw, 38px); margin-bottom: 4px; }
	.warn ul { margin-top: 8px; }

	.anatomy { background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: clamp(18px, 3vw, 28px); }
	.anatomy code { display: block; font-family: var(--mono); font-size: clamp(14px, 1.5vw, 18px); font-weight: 700; background: var(--ink); color: var(--white); padding: 16px 18px; border-radius: 8px; overflow-wrap: anywhere; }
	.anatomy ul { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; font-size: 16px; font-weight: 700; }
	.anatomy li { display: flex; align-items: center; gap: 10px; }
	.anatomy i { flex: none; width: 18px; height: 18px; border-radius: 4px; background: currentColor; }
	code .t-open, code .t-close { color: var(--cyan); }
	code .t-attr { color: var(--peri); }
	code .t-text { color: var(--white); }
	li .t-open, li .t-close { color: var(--cyan-deep); }
	li .t-attr { color: var(--peri); }
	li .t-text { color: var(--ink); }

	.lab { max-width: 1200px; margin: 0 auto; }
	.tabs { display: flex; flex-wrap: wrap; gap: 8px; }
	.tabs button { display: flex; align-items: baseline; gap: 8px; font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 20px; padding: 10px 16px 7px; border-radius: 6px; border: 3px solid var(--ink); background: var(--white); color: var(--ink); cursor: pointer; }
	.tabs button small { font-family: var(--mono); font-size: 12px; color: var(--cyan-deep); }
	.tabs button.on { background: var(--cyan-deep); color: var(--white); box-shadow: 4px 4px 0 var(--ink); }
	.tabs button.on small { color: var(--sky-light); }
	.project { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 48px); margin-top: 16px; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: clamp(18px, 3vw, 32px); }
	.code-wrap { position: relative; align-self: start; }
	.code { display: block; width: 100%; height: 420px; resize: vertical; margin: 0; border: none; background: var(--ink); color: #e8f4f4; font-family: var(--mono); font-size: 14px; line-height: 1.55; padding: 20px 22px; border-radius: var(--radius); white-space: pre; overflow: auto; tab-size: 2; }
	.code:focus { outline: 3px solid var(--cyan); }
	.code-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; }
	.code-actions button { font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 13px; padding: 6px 10px 3px; border-radius: 5px; border: 2px solid var(--white); background: var(--ink); color: var(--white); cursor: pointer; }
	.code-actions button:hover { background: var(--white); color: var(--ink); }
	.preview { grid-column: 1 / -1; border: 3px solid var(--ink); border-radius: var(--radius); overflow: hidden; }
	.url { display: block; font-family: var(--mono); font-size: 13px; padding: 8px 14px; background: var(--sky-light); border-bottom: 3px solid var(--ink); }
	.preview iframe { display: block; width: 100%; height: 420px; border: none; background: var(--white); }

	.shots { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px; }
	.shots li { display: grid; align-content: start; gap: 12px; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: 12px; }
	.shots img { width: 100%; border-radius: 8px; }
	.shots p { display: flex; gap: 10px; font-size: 17px; line-height: 1.4; color: #3e4650; }
	.shots b { font-family: var(--mono); color: var(--cyan-deep); }

	.upload, .challenges, .builds { max-width: 1200px; margin: 0 auto; padding: clamp(32px, 4vw, 48px) 0 0; scroll-margin-top: 60px; }
	.lede { font-size: 18px; color: #3e4650; margin: -6px 0 20px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
	.challenge { display: grid; align-content: start; gap: 6px; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: 16px 18px; }
	.challenge b { font-size: 22px; text-transform: uppercase; }
	.challenge p { font-size: 16px; line-height: 1.4; color: #3e4650; }
	.tier { justify-self: start; font-family: var(--mono); font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background: var(--sky-light); }
	.tier--medium { background: var(--cyan); }
	.tier--hard { background: var(--cyan-deep); color: var(--white); }
	.tier--boss { background: var(--red); color: var(--white); }

	.build-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
	.build-grid figure { margin: 0; display: grid; gap: 8px; background: var(--white); border-radius: var(--radius); padding: 10px; }
	.build-grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; }
	.build-grid figcaption { font-size: 18px; font-weight: 800; text-transform: uppercase; color: var(--ink); }
	.build-grid small { display: block; font-family: var(--mono); font-size: 13px; font-weight: 400; text-transform: none; color: #4a5560; }
	.back { display: flex; width: max-content; margin: 40px auto 0; border-color: var(--cyan-deep); background: var(--cyan-deep); color: var(--white); }

	@media (max-width: 820px) {
		.row, .project, .shots { grid-template-columns: minmax(0, 1fr); }
		.tabs { display: grid; grid-template-columns: repeat(2, 1fr); }
		.tabs button { justify-content: center; font-size: 16px; padding: 9px 8px 6px; }
		.code { font-size: 13px; padding: 16px; height: 320px; }
		.preview iframe { height: 360px; }
		.bar .brand span { display: none; }
	}
</style>
