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
