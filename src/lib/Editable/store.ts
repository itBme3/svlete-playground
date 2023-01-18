// type ObjectWithId = { id: string };

// export class Editable<UniqueType extends ObjectWithId> {
// 	initialValue: UniqueType;
// 	value: UniqueType;
// 	edits: Map<string, Partial<UniqueType>> = new Map();

// 	constructor(initialValue: UniqueType) {
// 		this.initialValue = initialValue;
// 		this.value =this.createProxy(initialValue);
// 	}

//     private createProxy = (initialObj) => {
//        return  new Proxy({...initialObj}, {
//             get: (target, prop) => {
//                 if (target[prop] && (typeof target[prop] === 'object')) {
//                     if(Array.isArray(target[prop])) {
//                         console.log(prop)
//                         target[prop] = target[prop].map(item => new Proxy(item, this.createProxy(item)));
//                         return target[prop].map(item => new Proxy(item, this.createProxy(item)));
//                     } else {
//                         target[prop] = new Proxy(target[prop], this.createProxy(target[prop]));
//                         return new Proxy(target[prop], this.createProxy(target[prop]));
//                     }
//                 } else {
//                     return target[prop];
//                 }
//             },
// 			set: (obj, prop, value) => {
// 				this.setEdits(obj, prop, value);
// 				return Reflect.set(obj, prop, value);
// 			}
// 		});
//     }

// 	private setEdits(obj: UniqueType, prop, value) {
// 		const { id } = obj;
// 		const currentEdit: Partial<UniqueType> = this.edits.get(id) || ({ id } as Partial<UniqueType>);
// 		currentEdit[prop] = value;
// 		this.edits.set(id, currentEdit);
// 	}
// }

// const editable = new Editable<{ id: string; x: number; y: number, z:{num: number; str: string}[] }>({ id: '123', x: 1, y: 2, z:[{num:1, str: "one"}, {num: 2, str: "two"}}] });

// // console.log(editable.edits);
// // editable.value.x = 3;
// // console.log(editable.edits);
// // console.log(editable.value);
// editable.value.z[0].num = 4;
// console.log(editable.edits);
// console.log(editable.initialValue);

const changes = [];

type ChangeProxyHandlers = {
	parentPath: () => string;
	path: () => string;
};

// const createChangeProxy = (
// 	obj,
// 	prop,
// 	ctx: { parent: string; index?: number },
// 	onChangeFunction
// ) => {
// 	const { parent, index } = ctx;
// 	const path = parent ? `${parent}.${prop}` : prop;
// 	const handler = {
// 		get: (target, prop, receiver) => {
// 			const value = Reflect.get(target, prop, receiver);
// 			if (typeof value === 'object') {
// 				return createChangeProxy(value, prop, {  }, handler);
// 			}
// 			return value;
// 		},
// 		set: (target, prop, value) => {
// 			onChangeFunction({ target, prop, value });
// 			return Reflect.set(target, prop, value);
// 		},
// 		deleteProperty: (target, prop) => {
// 			onChangeFunction({ target, prop });
// 			return Reflect.deleteProperty(target, prop);
// 		}
// 	};
// };

export const onChange = (objToWatch, onChangeFunction) => {
	const handler = {
		get(target, property, receiver) {
			console.log(receiver);
			// onChangeFunction({ target, property, receiver });
			const value = Reflect.get(target, property, receiver);
			if (typeof value === 'object') {
				return new Proxy(value, handler);
			}
			return value;
		},
		set(target, property, value) {
			onChangeFunction({ target, property, value });
			return Reflect.set(target, property, value);
		},
		deleteProperty(target, property) {
			onChangeFunction({ target, property });
			return Reflect.deleteProperty(target, property);
		}
	};
	return new Proxy(objToWatch, handler);
};

const obj = {
	id: '123',
	x: 1,
	y: 2,
	z: [
		{ num: 1, str: 'one' },
		{ num: 2, str: 'two' }
	]
};

const changingObj = onChange(obj, (change) => changes.push(change));

changingObj.z[0].num = 2;

console.log(changes);
