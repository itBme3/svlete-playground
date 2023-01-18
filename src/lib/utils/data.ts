export const getPage = (page: number = 10) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const items: {
				id: number;
				x: number;
				y: number;
				status: 'live' | 'draft' | 'archived';
			}[] = [];
			// for (let i = 0; i < count; i++) {
			// 	const x = i + startAt;
			// 	const status: 'live' | 'draft' | 'archived' =
			// 		i % 2 == 0 ? 'live' : i === 1 ? 'archived' : 'draft';
			// 	items.push({ id: x, name: `Thing #1`, status });
			// }
			resolve(items);
		}, 500);
	});
};
