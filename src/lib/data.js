export const SITE_URL = 'https://cs.fraserhacks.dev';
export const CLASSROOM_CODE = 'huglqpjv';
export const CLASSROOM_URL = 'https://classroom.google.com/c/ODA0NzMyMzIwMzI5?cjc=huglqpjv';
export const INSTAGRAM = 'jfss_cs';

export const SKILLS = ['Never played', 'Casual', 'Pretty good', 'Competitive'];

export const TYPES = {
	hw: { label: 'Hardware', tag: 'tag--hw' },
	sw: { label: 'Software', tag: 'tag--sw' },
	both: { label: 'HW + SW', tag: 'tag--both' }
};

export const meetings = [
	{ n: 1, title: 'LED heart breadboard', desc: 'Your first circuit, as a speed build. Fastest build wins a $10 Tims card!', href: '/meeting1' },
	{ n: 2, title: 'Smash Ultimate tourney', desc: 'Double elimination over two Thursdays. $15 / $10 / $5 for the top 3!!', href: '/meeting2' },
	{ n: 3, title: 'LED coin cell keychain', desc: 'Learn to solder and design your own case.' }
];

export const carousel = [
	{ href: 'https://github.com/flyingf15h/bing-bang-dream-adventure', short: 'Bing Bang Dream' },
	{ href: 'https://github.com/darshg321/Icey' },
	{ href: 'https://github.com/aaaaamed/pnake' },
	{ href: 'https://github.com/darshg321/arcadetris' },
	{ href: 'https://github.com/FraserHacks/FH26', short: 'FraserHacks 26' },
	{ href: 'https://github.com/darshg321/Spotiplay' },
	{ href: 'https://github.com/darshg321/EasyRP2040' }
];

export const boothTrinkets = [
	['miffy', 'Miffy'],
	['cinnamoroll', 'Cinnamoroll'],
	['smiski', 'Smiski'],
	['toothless', 'Flexi dragon'],
	['switch', 'Switch fidget'],
	['comb', 'Butterfly comb']
];

export const prizes = [
	['prize-tims', 'Tim Hortons gift card'],
	['prize-claude', ''],
	['prize-keycap', ''],
	['prize-certificate', '']
];

export const trinketGroups = [
	{
		title: 'Cute!',
		items: [
			['miffy', 'Miffy', 'keychain'],
			['miffy-bow', 'Bow bunny', 'keychain'],
			['cinnamoroll', 'Cinnamoroll', 'keychain'],
			['cinna-articulated', 'Articulated Cinnamoroll', 'flexi figure'],
			['cinna-buff', 'Buff Cinnamoroll', 'desk buddy'],
			['smiski', 'Smiski', 'clicker keychain'],
			['keroppi', 'Keroppi', 'keychain'],
			['frog-bun', 'Frog bun', 'fidget keychain'],
			['flexi-dragon', 'Flexi dragon', 'articulated']
		]
	},
	{
		title: 'Cool!!',
		items: [
			['butterfly-comb', 'Butterfly comb', 'flip it'],
			['keycap-fidget', 'Keycap fidget', 'real switch inside'],
			['switch-fidget', 'Switch fidget', 'keychain'],
			['toothless', 'Flexi Toothless', 'print in place'],
			['minecraft-frogs', 'Minecraft frogs', 'keychain'],
			['cinna-flexi', 'Flexi Cinnamoroll', 'fidget'],
			['infinity-fidget', 'Infinity clicker', 'fidget', true],
			['crossbow', 'Mini crossbow', 'desk toy', true]
		]
	},
	{
		title: 'Useful!',
		items: [
			['phone-stand', 'Phone stand', 'folds onto your keys'],
			['cable-croc', 'Cable croc', 'eats your cables'],
			['cable-clip', 'Cable clip', 'slide to unlock'],
			['click-clack', 'Click clack', 'wrench fidget', true],
			['button-clicker', 'Button clicker', 'fidget', true]
		]
	}
];

export const defaultMembers = [
	{ name: 'Darsh Gupta', role: 'President', exec: true, github: 'darshg321', projects: ['https://github.com/flyingf15h/bing-bang-dream-adventure', 'https://github.com/darshg321/Icey', 'https://github.com/darshg321/arcadetris', 'https://github.com/darshg321/Ultisense'] },
	{ name: 'Yichen Li', role: 'Vice President', exec: true, github: '', projects: [] },
	{ name: 'Jason Chou', role: 'Vice President', exec: true, github: 'JasonChou0105', projects: ['https://github.com/JasonChou0105/3d_hand_playground'] },
	{ name: 'Aaamed', role: 'Builder', exec: false, github: 'aaaaamed', projects: ['https://github.com/aaaaamed/pnake'] }
];
