export const SITE_URL = 'https://cs.fraserhacks.dev';
export const CLASSROOM_CODE = 'huglqpjv';
export const CLASSROOM_URL = 'https://classroom.google.com/c/ODA0NzMyMzIwMzI5?cjc=huglqpjv';

export const TYPES = {
	hw: { label: 'Hardware', tag: 'tag--hw' },
	sw: { label: 'Software', tag: 'tag--sw' },
	both: { label: 'HW + SW', tag: 'tag--both' }
};

export const projects = [
	{ name: 'Bing Bang Dream Adventure', short: 'Bing Bang Dream', img: 'bingbang', frame: 'shot', type: 'both', by: 'Darsh', href: 'https://github.com/flyingf15h/bing-bang-dream-adventure', desc: 'Bad Apple!! rhythm game played by flicking two IMU controllers.' },
	{ name: 'Icey', img: 'icey', frame: 'cut bg-red', type: 'hw', by: 'Darsh', href: 'https://github.com/darshg321/Icey', desc: 'Uno-sized iCE40 FPGA board for learning, with VGA out.' },
	{ name: '3D Hand Playground', img: 'hand', frame: 'shot', type: 'sw', by: 'Jason', href: 'https://github.com/JasonChou0105/3d_hand_playground', desc: 'Pinch to grab and throw 3D objects with your hand.' },
	{ name: 'Binlytic AI', img: 'binlytic', frame: 'shot', type: 'sw', by: 'Bhuvanesh', href: 'https://github.com/BhuvaneshN09/BinlyticAI', desc: 'Webcam + CLIP prototype that sorts waste into bins.' },
	{ name: 'arcadetris', img: 'arcadetris', frame: 'cut bg-teal', type: 'hw', by: 'Darsh', href: 'https://github.com/darshg321/arcadetris', desc: 'Two-player LED matrix Tetris arcade, built at HC Undercity.' },
	{ name: 'pnake', img: 'pnake', frame: 'shot', type: 'sw', by: 'Aaamed', href: 'https://github.com/aaaaamed/pnake', desc: 'Pac-Man and Snake combined into one game, in under 1 KB.' },
	{ name: 'JFSS SAC portal', img: 'jfsssac', frame: 'shot', type: 'sw', by: 'JFSS SAC', href: 'https://github.com/jfss-sac/jfss-sac-v2', desc: 'Club and SAC workflow portal for John Fraser.' },
	{ name: 'Spotiplay', img: 'spotiplay', frame: 'cut bg-cyan', type: 'hw', by: 'Darsh', href: 'https://github.com/darshg321/Spotiplay', desc: 'Wifi Spotify "now playing" display.' },
	{ name: 'FraserHacks 2026', short: 'FraserHacks 26', img: 'fh26', frame: 'shot', type: 'sw', by: 'FraserHacks team', href: 'https://github.com/FraserHacks/FH26', desc: "Mississauga's largest high school hackathon. 83 hackers, 28 projects." },
	{ name: 'Ultisense', img: 'ultisense', frame: 'shot', type: 'hw', by: 'Darsh', href: 'https://github.com/darshg321/Ultisense', desc: 'ESP32-S3 dev board made to sense as many things as possible.' },
	{ name: 'dayoneof', img: 'dayoneof', frame: 'shot', type: 'sw', by: 'Darsh', href: 'https://github.com/hackclub/dayoneof', desc: 'Hack Club YSWS: post a video every day for a month.' },
	{ name: 'FraserHacks 2027', img: 'fh27', frame: 'shot', type: 'sw', by: 'FraserHacks team', href: 'https://github.com/FraserHacks/FraserHacks2027', desc: 'Event site for FraserHacks 2027.' },
	{ name: 'EasyRP2040', img: 'easyrp2040', frame: 'cut bg-peri', type: 'hw', by: 'Darsh', href: 'https://github.com/darshg321/EasyRP2040', desc: 'Pico-format RP2040 board with debug LEDs and a 9-DOF IMU.' }
];

export const carousel = ['bingbang', 'icey', 'pnake', 'arcadetris', 'binlytic', 'fh26', 'spotiplay', 'easyrp2040'].map(
	(img) => projects.find((p) => p.img === img)
);

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
