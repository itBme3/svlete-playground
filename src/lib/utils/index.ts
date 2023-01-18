import type { DoNotCare } from '@madhive/wingsuit/types';

/**
 * @param object: an object to get a value from.
 * @param path: a path within the object, leading to the value you want. It is dot-separated. Example: "user.meta.nickname".
 * @return: the value from the object at that path, or undefined if nothing exists within the object at that path.
 */
export const objectLookup = (object: DoNotCare, path: string): DoNotCare | undefined => {
	if (!path || typeof object !== 'object' || !object) {
		return undefined;
	}

	const depth = path.split('.');
	let result = object[depth[0]];
	if (result !== undefined) {
		for (let i = 1; i < depth?.length; i++) {
			result = typeof result === 'object' ? result[depth[i]] : undefined;
			if (result === undefined) {
				break;
			}
		}
	}
	return result;
};

/**
 * Determines all key paths (including nested object key paths) available on an object
 * @param {Object} obj record to derive key paths from
 * the following params are used for method's recursive functionality
 * @param {string} parentKey
 * @param keyPaths
 * @returns {string[]} an array of key paths found in object
 */
export function objectKeyPaths(
	obj: Record<string, DoNotCare>,
	parentKey = '',
	keyPaths: string[] = []
) {
	if (!obj || typeof obj !== 'object' || !Object.keys(obj).length) {
		if (parentKey) {
			keyPaths.push(parentKey);
		}
		return keyPaths;
	}
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const value = obj[i];
			const currentKey = parentKey ? `${parentKey}.${i}` : `${i}`;
			objectKeyPaths(value, currentKey, keyPaths);
		}
	}
	for (const key in obj) {
		const value = obj[key];
		const currentKey = parentKey ? `${parentKey}.${key}` : key;
		objectKeyPaths(value, currentKey, keyPaths);
	}

	return keyPaths;
}

export const setValueInObject = (
	object: any,
	keyPath: string,
	value: any,
	handleMissing = 'force'
) => {
	let obj = object;
	if (!obj || typeof obj !== 'object') {
		switch (handleMissing) {
			case 'throw':
				throw new Error(`typeof object must extend object (received ${typeof obj})`);
			case 'silent':
				return obj;
			default:
				obj = {};
		}
	}
	let ref = obj;
	const path = keyPath.split('.');
	for (let i = 0; i <= path.length - 1; i++) {
		const key = path[i];
		const nextKey = path[i + 1];
		if (!ref?.[key]) {
			if (handleMissing === 'throw') {
				throw new Error(`Missing key: ${key}`);
			} else if (handleMissing === 'silent') {
				return obj;
			} else if (handleMissing === 'force') {
				ref[key] = isNaN(parseInt(nextKey)) ? {} : Array(parseInt(nextKey) + 1).fill(undefined);
			}
		}

		if (i === path.length - 1) {
			ref[key] = value;
		} else {
			ref = ref[key];
		}
	}
	return Array.isArray(obj) ? [...obj] : { ...obj };
};
