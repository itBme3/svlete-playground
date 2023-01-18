export const PropertyType = {
	function: 'function',
	number: 'number',
	string: 'string',
	nan: 'nan',
	integer: 'integer',
	float: 'float',
	boolean: 'boolean',
	date: 'date',
	bigint: 'bigint',
	symbol: 'symbol',
	undefined: 'undefined',
	null: 'null',
	array: 'array',
	object: 'object',
	unknown: 'unknown',
	promise: 'promise',
	void: 'void',
	never: 'never',
	map: 'map',
	set: 'set'
} as const;

export type PropertyType = keyof typeof PropertyType;

export const getPropertyType = (data): PropertyType => {
	const t = typeof data;
	switch (t) {
		case 'undefined':
			return PropertyType.undefined;
		case 'string':
			return PropertyType.string;
		case 'number':
			return isNaN(data) ? PropertyType.nan : PropertyType.number;
		case 'boolean':
			return PropertyType.boolean;
		case 'function':
			return PropertyType.function;
		case 'bigint':
			return PropertyType.bigint;
		case 'symbol':
			return PropertyType.symbol;
		case 'object':
			if (Array.isArray(data)) {
				return PropertyType.array;
			}
			if (data === null) {
				return PropertyType.null;
			}
			if (
				data.then &&
				typeof data.then === 'function' &&
				data.catch &&
				typeof data.catch === 'function'
			) {
				return PropertyType.promise;
			}
			if (typeof Map !== 'undefined' && data instanceof Map) {
				return PropertyType.map;
			}
			if (typeof Set !== 'undefined' && data instanceof Set) {
				return PropertyType.set;
			}
			if (typeof Date !== 'undefined' && data instanceof Date) {
				return PropertyType.date;
			}
			return PropertyType.object;
		default:
			return PropertyType.unknown;
	}
};

export type PropertyDefinition = {
	type?: PropertyType;
};

export class Property {}
