<script>
	import { SITE_URL } from '#lib/data.js';

	const DESCRIPTION = 'Meeting 3: Arduino Uno intro. Blink LEDs, read buttons and knobs, spin servos and fans. Challenges for people who have built stuff before.';
	const IMG = '/assets/meetings/3';

	let { data } = $props();

	const parts = {
		led: 'LED',
		resistor: 'Resistor',
		button: 'Button',
		potentiometer: 'Knob (potentiometer)',
		servo: 'Servo',
		motor: 'DC motor',
		transistor: 'Transistor',
		diode: 'Diode'
	};

	const projects = [
		{
			id: 'blink',
			title: 'Blink',
			about: 'The "hello world" of hardware. The Uno has an LED built in, so this works with nothing plugged in.',
			parts: ['led', 'resistor'],
			steps: [
				'Plug in the Uno. Pick Tools → Board → Arduino Uno, then Tools → Port.',
				'Paste the code and hit Upload (→). The little L LED blinks.',
				'Change 500 to 100 and upload again.',
				'Your own LED: pin 13 → 220Ω → long leg, short leg → GND.'
			],
			code: `void setup() {
  pinMode(13, OUTPUT);     // runs once
}

void loop() {              // runs forever
  digitalWrite(13, HIGH);  // on
  delay(500);              // wait 500 ms
  digitalWrite(13, LOW);   // off
  delay(500);
}`
		},
		{
			id: 'button',
			title: 'Button',
			about: 'Now the Uno reads something. The pin is HIGH until the button connects it to GND.',
			parts: ['button', 'led', 'resistor'],
			steps: [
				'Keep your LED on pin 13.',
				'Button across the middle gap. One leg → pin 2, the diagonal leg → GND.',
				'Upload and hold the button.'
			],
			code: `void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(2) == LOW) {  // pressed
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}`
		},
		{
			id: 'knob',
			title: 'Knob',
			about: 'analogRead turns the knob into 0 to 1023. analogWrite dims the LED by flicking it on and off really fast.',
			parts: ['potentiometer', 'led', 'resistor'],
			steps: [
				'Knob outer legs → 5V and GND. Middle leg → A0.',
				'Move the LED to pin 9. Dimming only works on pins with a ~.',
				'Upload, then open Tools → Serial Plotter and turn the knob.'
			],
			code: `void setup() {
  pinMode(9, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(A0);  // 0 to 1023
  analogWrite(9, knob / 4);   // 0 to 255
  Serial.println(knob);
}`
		},
		{
			id: 'servo',
			title: 'Servo',
			about: 'A servo turns to an exact angle, 0° to 180°, and holds it.',
			parts: ['servo', 'potentiometer'],
			steps: [
				'Brown → GND, red → 5V, orange → pin 9.',
				'Keep the knob on A0.',
				'Upload. The servo follows the knob.'
			],
			code: `#include <Servo.h>

Servo arm;

void setup() {
  arm.attach(9);
}

void loop() {
  int angle = map(analogRead(A0), 0, 1023, 0, 180);
  arm.write(angle);
  delay(15);
}`
		},
		{
			id: 'fan',
			title: 'Fan',
			about: 'Motors need way more power than a pin gives. The pin flips a transistor, and the transistor switches the motor.',
			parts: ['motor', 'transistor', 'diode', 'resistor', 'potentiometer'],
			steps: [
				'Transistor flat side facing you: legs are E, B, C.',
				'E → GND. B → 1kΩ → pin 5.',
				'Motor: one wire → 5V, the other → C.',
				'Diode across the motor wires, stripe on the 5V side.',
				'Upload and turn the knob.'
			],
			code: `void setup() {
  pinMode(5, OUTPUT);
}

void loop() {
  int speed = map(analogRead(A0), 0, 1023, 0, 255);
  analogWrite(5, speed);
}`
		}
	];

	const challenges = [
		['Easy', 'Traffic light', 'Red, yellow, green LEDs that cycle. Add a crosswalk button.'],
		['Easy', 'Toggle', 'Press once for on, again for off. Harder than it sounds!'],
		['Medium', 'Reaction timer', 'LED turns on at a random time. Press fast and print your time in ms.'],
		['Medium', 'No delay()', 'Blink 3 LEDs at 3 different speeds at once. Hint: millis().'],
		['Hard', 'Simon says', '4 LEDs, 4 buttons, a pattern that grows every round.'],
		['Boss', 'Bare metal', 'Blink pin 13 with PORTB instead of digitalWrite. How much faster is it?']
	];

	const credits = [
		['Arduino_uno_r3_isometr.jpg', 'Uno: MakeMagazinDE, CC BY-SA 4.0'],
		['5mm_Red_LED.jpg', 'LED: oomlout, CC BY-SA 2.0'],
		['220_ohms_5%25_axial_resistor.jpg', 'resistor: oomlout, CC BY-SA 2.0'],
		['Tactile_switches.jpg', 'button: Scwerllguy, CC BY-SA 3.0'],
		['Potentiometer.jpg', 'knob: Iainf, CC BY 2.5'],
		['Tower_Pro_SG90_micro_servo_motor.jpg', 'servo: Suyash Dwivedi, CC BY-SA 4.0'],
		['Двигатели_Mabuchi_FA-130.jpg', 'motor: Monoklon, CC BY-SA 3.0'],
		['Generic_2N2222A.jpeg', 'transistor: MarkMossGH, CC0'],
		['1N4001_Diode.jpg', 'diode: oomlout, CC BY-SA 2.0']
	];

	let active = $state('blink');
	let copied = $state(false);
	const project = $derived(projects.find((p) => p.id === active));

	async function copy() {
		await navigator.clipboard.writeText(project.code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Meeting 3: Arduino | Fraser Comp Sci Club</title>
	<meta name="description" content={DESCRIPTION}>
	<link rel="canonical" href="{SITE_URL}/meeting3">
	<meta property="og:title" content="Meeting 3: Arduino | Fraser Comp Sci Club">
	<meta property="og:description" content={DESCRIPTION}>
	<meta property="og:url" content="{SITE_URL}/meeting3">
	<meta property="og:image" content="{SITE_URL}/assets/og.png">
</svelte:head>

<div class="bar">
	<a class="brand" href="/#meetings"><img src="/assets/logo_small.webp" alt="Fraser Comp Sci Club" width="36" height="36"><span>Meeting 03</span></a>
	<a class="jump" href="#challenges">Challenges</a>
</div>

<main>
	<header class="section halftone">
		<div class="wrap">
			<span class="label">Thu Oct 29 · 11:05 AM · Rm 183 · Open meeting, no sign up needed</span>
			<h1 class="section-title"><span class="echo" data-echo="Arduino!!">Arduino!!</span></h1>
			<p class="section-lede">Write code that controls real things. <b>Never coded? Start at Blink. Built stuff before? Skip to the challenges.</b></p>
		</div>
	</header>

	<div class="guide">
		<section class="row">
			<div class="text">
				<h2>Meet the Uno</h2>
				<p>A tiny computer that runs one program forever. Its pins can <b>turn things on and off</b> and <b>read buttons and sensors</b>.</p>
				<ul>
					<li><b>Pins 2 to 13:</b> on or off. The ones with a <b>~</b> can also dim.</li>
					<li><b>A0 to A5:</b> read a knob or sensor as 0 to 1023.</li>
					<li><b>5V and GND:</b> power for your breadboard.</li>
				</ul>
			</div>
			<div class="media">
				<img class="uno" src="{IMG}/uno.webp" alt="Arduino Uno board" width="800" height="625">
			</div>
		</section>

		<section class="row warn">
			<div class="text">
				<h2>Don't fry it!!</h2>
				<ul>
					<li><b>Every LED still needs a resistor.</b></li>
					<li><b>Never plug a motor straight into a pin.</b></li>
					<li><b>Unplug USB before rewiring.</b></li>
				</ul>
			</div>
		</section>

		<section class="lab" id="projects">
			<div class="tabs" role="tablist">
				{#each projects as p, i (p.id)}
					<button role="tab" aria-selected={active === p.id} class:on={active === p.id} onclick={() => (active = p.id)}>
						<small>{String(i + 1).padStart(2, '0')}</small>{p.title}
					</button>
				{/each}
			</div>

			<div class="project" role="tabpanel">
				<div class="text">
					<h2>{project.title}</h2>
					<p>{project.about}</p>
					<div class="parts">
						{#each project.parts as part}
							<figure><img src="{IMG}/{part}.webp" alt="" loading="lazy"><figcaption>{parts[part]}</figcaption></figure>
						{/each}
					</div>
					<ol>
						{#each project.steps as s}<li>{s}</li>{/each}
					</ol>
				</div>
				<div class="code-wrap">
					<button onclick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
					<pre class="code"><code>{project.code}</code></pre>
				</div>
			</div>
		</section>

		<section class="challenges" id="challenges">
			<h2>Challenges</h2>
			<p class="lede">Finished the projects, or already know your stuff? No code given. Show an exec when yours works!</p>
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
				<h2>Everyone's builds!!</h2>
				<div class="build-grid">
					{#each data.builds as b (b.id)}
						<figure><img src={b.src} alt={b.name} loading="lazy"><figcaption>{b.name}<small>by {b.by}</small></figcaption></figure>
					{/each}
				</div>
			</section>
		{/if}

		<a class="btn back" href="/#meetings">← All meetings</a>
		<p class="credits">Photos from Wikimedia Commons: {#each credits as [file, text], i}<a href="https://commons.wikimedia.org/wiki/File:{file}" target="_blank" rel="noopener">{text}</a>{i < credits.length - 1 ? ' · ' : ''}{/each}</p>
	</div>
</main>

<style>
	.bar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px var(--gutter); background: var(--ink); box-shadow: 0 4px 0 var(--teal-dark); }
	.bar .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 800; text-transform: uppercase; }
	.bar .brand img { width: 36px; }
	.jump { font-weight: 800; text-transform: uppercase; font-size: 14px; padding: 8px 12px 5px; border-radius: 5px; background: var(--white); color: var(--ink); text-decoration: none; }

	header { background: linear-gradient(100deg, var(--teal) 0%, var(--teal-dark) 100%); padding: clamp(40px, 6vw, 72px) 0; }
	header .label { display: block; margin-bottom: 10px; font-size: 14px; }
	.section-lede b { background: var(--teal-dark); padding: 0 5px; }

	.guide { background: var(--cream); color: var(--ink); padding: clamp(32px, 4vw, 56px) var(--gutter) 48px; }
	.row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; padding: clamp(20px, 3vw, 36px) 0; }
	h2 { font-size: clamp(34px, 4vw, 52px); color: var(--teal-dark); margin-bottom: 16px; }
	.text p, .text li { font-size: 18px; line-height: 1.45; color: #3e4a4a; }
	.text b { color: var(--ink); }
	.text ul, .text ol { margin: 12px 0 0; padding-left: 22px; display: grid; gap: 8px; }
	.uno { width: 100%; max-width: 520px; display: block; margin: 0 auto; height: auto; border-radius: var(--radius); background: var(--white); }
	.warn { display: block; background: var(--white); border-radius: var(--radius); padding: 20px clamp(20px, 3vw, 40px); border: 3px solid var(--red); margin: 12px auto 32px; }
	.warn h2 { color: var(--red); font-size: clamp(28px, 3vw, 38px); margin-bottom: 4px; }
	.warn ul { margin-top: 8px; }

	.lab { max-width: 1200px; margin: 0 auto; }
	.tabs { display: flex; flex-wrap: wrap; gap: 8px; }
	.tabs button { display: flex; align-items: baseline; gap: 8px; font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 20px; padding: 10px 16px 7px; border-radius: 6px; border: 3px solid var(--ink); background: var(--white); color: var(--ink); cursor: pointer; }
	.tabs button small { font-family: var(--mono); font-size: 12px; color: var(--teal-dark); }
	.tabs button.on { background: var(--teal-dark); color: var(--white); box-shadow: 4px 4px 0 var(--ink); }
	.tabs button.on small { color: var(--sky-light); }
	.project { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 48px); margin-top: 16px; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: clamp(18px, 3vw, 32px); }
	.parts { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
	.parts figure { margin: 0; display: grid; gap: 4px; justify-items: center; width: 92px; }
	.parts img { width: 92px; height: 72px; object-fit: contain; }
	.parts figcaption { font-size: 13px; font-weight: 700; text-align: center; color: #4a5a5a; line-height: 1.2; }
	.code-wrap { position: relative; align-self: start; }
	.code { margin: 0; background: var(--ink); color: #e8f4f4; font-family: var(--mono); font-size: 15px; line-height: 1.55; padding: 20px 22px; border-radius: var(--radius); overflow-x: auto; }
	.code-wrap button { position: absolute; top: 10px; right: 10px; font-family: var(--display); font-weight: 800; text-transform: uppercase; font-size: 13px; padding: 6px 10px 3px; border-radius: 5px; border: 2px solid var(--white); background: transparent; color: var(--white); cursor: pointer; }
	.code-wrap button:hover { background: var(--white); color: var(--ink); }

	.challenges, .builds { max-width: 1200px; margin: 0 auto; padding: clamp(32px, 4vw, 48px) 0 0; scroll-margin-top: 60px; }
	.lede { font-size: 18px; color: #3e4a4a; margin: -6px 0 20px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
	.challenge { display: grid; align-content: start; gap: 6px; background: var(--white); border: 3px solid var(--ink); border-radius: var(--radius); padding: 16px 18px; }
	.challenge b { font-size: 22px; text-transform: uppercase; }
	.challenge p { font-size: 16px; line-height: 1.4; color: #3e4a4a; }
	.tier { justify-self: start; font-family: var(--mono); font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background: var(--sky-light); }
	.tier--medium { background: var(--cyan); }
	.tier--hard { background: var(--teal); color: var(--white); }
	.tier--boss { background: var(--red); color: var(--white); }

	.build-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
	.build-grid figure { margin: 0; display: grid; gap: 8px; background: var(--white); border-radius: var(--radius); padding: 10px; }
	.build-grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; }
	.build-grid figcaption { font-size: 18px; font-weight: 800; text-transform: uppercase; color: var(--ink); }
	.build-grid small { display: block; font-family: var(--mono); font-size: 13px; font-weight: 400; text-transform: none; color: #4a5a5a; }
	.back { display: flex; width: max-content; margin: 40px auto 0; border-color: var(--teal-dark); background: var(--teal-dark); color: var(--white); }
	.credits { max-width: 1200px; margin: 32px auto 0; font-family: var(--mono); font-size: 11px; color: #7a8888; text-align: center; }
	.credits a { color: inherit; }

	@media (max-width: 820px) {
		.row, .project { grid-template-columns: minmax(0, 1fr); }
		.tabs { display: grid; grid-template-columns: repeat(3, 1fr); }
		.tabs button { justify-content: center; font-size: 16px; padding: 9px 8px 6px; }
		.code { font-size: 13px; padding: 16px; }
		.bar .brand span { display: none; }
	}
</style>
