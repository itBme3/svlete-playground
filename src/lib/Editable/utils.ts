import { setValueInObject } from '$lib/utils';
import { objectLookup } from '@madhive/wingsuit';

interface Edit<T = any> {
	data: T;
	keys: Set<string>;
}
type EditMap = Map<string, Edit>;

type EditableProxy<T = object> = {
	id: string;
	_edits?: EditMap;
	hasEdits: () => boolean;
	reset: () => void;
} & T;

export const isEditableProxy = (obj: any) => {
	if (obj && typeof obj === 'object') {
		if (hasKey(obj, 'id') && hasKey(obj, '_edits') && hasKey(obj, 'hasEdits')) {
			return true;
		}
	}
	return false;
};

export const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T => k in obj;

export const createChangeProxy = <T>(
	obj: T,
	onChangeFunction: Function,
	parentPath?: string,
	parentId?: string
): any => {
	if (Array.isArray(obj)) {
		return obj.map((item, i) => createChangeProxy(item, onChangeFunction, `${i}`));
	}
	const handler = {
		get: (target: any, prop: string, receiver: unknown) => {
			const value = Reflect.get(target, prop, receiver);
			const id = parentId || target.id;
			const keyPath = parentPath && typeof prop === 'string' ? `${parentPath}.${prop}` : prop;
			if (typeof value === 'object') {
				if (Array.isArray(value)) {
					if (typeof prop === 'string') {
						return value.map((item, i) =>
							createChangeProxy(item, onChangeFunction, `${keyPath}.${i}`, id)
						);
					}
					return Reflect.get(target, prop, {
						...target,
						[prop]: value.map((item, i) =>
							createChangeProxy(item, onChangeFunction, `${keyPath}.${i}`, id)
						)
					});
				}
				return createChangeProxy(value, onChangeFunction, keyPath, id);
			}
			return value;
		},
		set: (target: any, prop: any, value: any) => {
			const id = parentId || target.id;
			let path = parentPath || '';
			if (typeof prop === 'string') {
				path = `${path}.${prop}`;
			}
			onChangeFunction(id, path, value);
			return Reflect.set(target, prop, value);
		}
	};
	return new Proxy(obj, handler);
};
export function createChangeObserver<T>(
	obj: T,
	onChangeFunction: Function,
	parentPath?: string,
	parentId?: string
): any {
	if (Array.isArray(obj)) {
		return obj.map((item, i) => createChangeObserver(item, onChangeFunction, `${i}`));
	}
	const handler = {
		get: (target: any, prop: string, receiver: unknown) => {
			const value = Reflect.get(target, prop, receiver);
			const id = parentId || target.id;
			const keyPath = parentPath && typeof prop === 'string' ? `${parentPath}.${prop}` : prop;
			if (typeof value === 'object') {
				if (Array.isArray(value)) {
					if (typeof prop === 'string') {
						return value.map((item, i) =>
							createChangeObserver(item, onChangeFunction, `${keyPath ? `${keyPath}.${i}` : i}`, id)
						);
					}
					return Reflect.get(target, prop, {
						...target,
						[prop]: value.map((item, i) =>
							createChangeObserver(item, onChangeFunction, `${keyPath ? `${keyPath}.${i}` : i}`, id)
						)
					});
				}
				return createChangeObserver(value, onChangeFunction, keyPath, id);
			}
			return value;
		},
		set: (target: any, prop: any, value: any) => {
			const id = parentId || target.id;
			let path = parentPath || '';
			if (typeof prop === 'string') {
				path = `${path ? `${path}.${prop}` : prop}`;
			}
			onChangeFunction(id, path, value, Reflect.get(target, prop));
			return true;
		}
	};
	return new Proxy(obj, handler);
}

export class ChangeProxy {
	data: any;
	changes: Record<string, any> = {};
	originalData: any;

	onChange: (id: string, path: string, value: any) => void;

	constructor(data: any, onChange?: (id: string, path: string, value: any) => void) {
		if (typeof onChange === 'function') {
			this.onChange = onChange.bind(this);
		}
		this.originalData = data;
		this.data = createChangeObserver(data, this._onChange.bind(this));
	}

	_onChange(id: string, path: string, value: any) {
		const change: { [key: string]: any } = this.changes?.[id] || {};
		const val = objectLookup(this.data, path);
		const unIndexedPath =
			parseInt(path.split('.')[0]) >= 0 ? path.split('.').slice(1).join('.') : path;
		if (val === value) {
			if (unIndexedPath in change) {
				delete change[unIndexedPath];
			}
		} else {
			change[unIndexedPath] = value;
		}
		if (Object.keys(change).length) {
			this.changes[id] = change;
		} else {
			if (id in this.changes) {
				delete this.changes[id];
			}
		}
		if (typeof this.onChange === 'function') {
			this.onChange(id, path, value);
		}
	}

	reset() {
		this.changes = {};
	}
	get editedData() {
		const dataArr = Array.isArray(this.data) ? this.data : [this.data];
		const dataWithEdits = dataArr.map((item) => {
			const itemChanges = this.changes[item.id] || {};
			if (!itemChanges) {
				return item;
			}
			let itemWithChanges = { ...item };
			const changePaths = Object.keys(itemChanges);
			for (let i = 0; i < changePaths.length; i++) {
				itemWithChanges = setValueInObject(
					itemWithChanges,
					changePaths[i],
					itemChanges[changePaths[i]]
				);
			}
			return itemWithChanges;
		});
		return Array.isArray(this.data) ? dataWithEdits : dataWithEdits[0];
	}

	get dataToSave() {
		return (Array.isArray(this.data) ? [...this.data] : [{ ...this.data }]).reduce((acc, obj) => {
			const itemChanges = this.changes[obj.id];
			if (!itemChanges || Object.keys(itemChanges).length === 0) {
				return acc;
			}
			for (const path in itemChanges) {
				obj = setValueInObject(JSON.parse(JSON.stringify(obj)), path, itemChanges[path], 'force');
			}

			acc[obj.id] = obj;
			return acc;
		}, {});
	}
}
