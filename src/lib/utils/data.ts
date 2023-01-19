import Chance from 'chance';
const chance = new Chance();

export const getPage = (page: number = 1) => {
	const count = 10;
	return new Promise((resolve) => {
		setTimeout(() => {
			const items: {
				id: string;
				x: number;
				y: number;
				others: { x: number; y: number }[];
				status: 'live' | 'draft' | 'archived';
			}[] = [];
			for (let i = 0; i < count; i++) {
				const n = (page - 1) * count + i;
				items.push({
					id: `${n}`,
					x: n * 11,
					y: n * 11,
					others: [{ x: n * 12, y: n * 12 }],
					status: chance.pickone(['live', 'draft', 'archived'])
				});
			}
			resolve(items);
		}, 500);
	});
};
