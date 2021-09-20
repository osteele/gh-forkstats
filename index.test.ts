import { comparator } from './index';

test('comparator runs projection function', () => {
    const lst = [{ k: 1 }, { k: 3 }, { k: 2 }];
    lst.sort(comparator(o => o.k));
    expect(lst.map(({ k }) => k)).toEqual([1, 2, 3]);
});

test('comparator follows totalCount', () => {
    const lst = [
        { k: { totalCount: 1 } },
        { k: { totalCount: 3 } },
        { k: { totalCount: 2 } },
    ];
    lst.sort(comparator(o => o.k));
    expect(lst.map(({ k }) => k.totalCount)).toEqual([1, 2, 3]);
});
