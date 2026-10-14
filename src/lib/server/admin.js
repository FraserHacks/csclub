import { createHash, timingSafeEqual } from 'node:crypto';
import { ADMIN_PASSWORD } from '$app/env/private';

const COOKIE = 'admin';
const hash = (s) => createHash('sha256').update(`csclub:${s}`).digest();

export const hasAdmin = () => Boolean(ADMIN_PASSWORD);

export function checkPassword(password) {
	return hasAdmin() && timingSafeEqual(hash(password), hash(ADMIN_PASSWORD));
}

export function isAdmin(cookies) {
	const value = cookies.get(COOKIE);
	return Boolean(value && hasAdmin() && value === hash(ADMIN_PASSWORD).toString('hex'));
}

export function login(cookies) {
	cookies.set(COOKIE, hash(ADMIN_PASSWORD).toString('hex'), { path: '/', httpOnly: true, sameSite: 'strict', secure: true, maxAge: 60 * 60 * 24 * 30 });
}

export function logout(cookies) {
	cookies.delete(COOKIE, { path: '/' });
}
