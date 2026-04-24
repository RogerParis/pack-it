import { usePackingStore } from '../packingStore';

const initialState = {
  lists: { default: { name: 'Default', toBuy: [], toPack: [], suggestions: [] } },
  activeList: 'default' as string | null,
  lastSyncedAt: null,
};

const item = (id: string, name: string) => ({ id, name, packed: false, category: 'extras' });

beforeEach(() => {
  usePackingStore.setState(initialState);
});

describe('addItem', () => {
  it('adds item to the active list type', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(1);
    expect(lists[activeList!].toPack[0].name).toBe('Passport');
  });

  it('does nothing when there is no active list', () => {
    usePackingStore.setState({ activeList: null });
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    const { lists } = usePackingStore.getState();
    expect(lists['default'].toPack).toHaveLength(0);
  });
});

describe('removeItem', () => {
  it('removes item by id from the active list type', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().removeItem('toPack', '1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(0);
  });

  it('leaves other items untouched', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().addItem('toPack', item('2', 'Charger'));
    usePackingStore.getState().removeItem('toPack', '1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(1);
    expect(lists[activeList!].toPack[0].id).toBe('2');
  });
});

describe('togglePacked', () => {
  it('marks an unpacked item as packed', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().togglePacked('1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack[0].packed).toBe(true);
  });

  it('marks a packed item as unpacked', () => {
    usePackingStore.getState().addItem('toPack', { ...item('1', 'Passport'), packed: true });
    usePackingStore.getState().togglePacked('1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack[0].packed).toBe(false);
  });
});

describe('moveItem', () => {
  it('moves item from source list to target list', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().moveItem('toPack', 'toBuy', '1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(0);
    expect(lists[activeList!].toBuy).toHaveLength(1);
    expect(lists[activeList!].toBuy[0].name).toBe('Passport');
  });

  it('resets packed state on moved item', () => {
    usePackingStore.getState().addItem('toPack', { ...item('1', 'Passport'), packed: true });
    usePackingStore.getState().moveItem('toPack', 'toBuy', '1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toBuy[0].packed).toBe(false);
  });

  it('does nothing when source and target are the same', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().moveItem('toPack', 'toPack', '1');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(1);
  });
});

describe('clearList', () => {
  it('empties the specified list type', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().addItem('toPack', item('2', 'Charger'));
    usePackingStore.getState().clearList('toPack');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack).toHaveLength(0);
  });

  it('leaves other list types untouched', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().addItem('toBuy', item('2', 'Sunscreen'));
    usePackingStore.getState().clearList('toPack');
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toBuy).toHaveLength(1);
  });
});

describe('createList', () => {
  it('creates a new empty list and returns its id', () => {
    const id = usePackingStore.getState().createList('Holiday');
    const { lists } = usePackingStore.getState();
    expect(lists[id]).toBeDefined();
    expect(lists[id].name).toBe('Holiday');
    expect(lists[id].toPack).toHaveLength(0);
  });
});

describe('deleteList', () => {
  it('removes the list from state', () => {
    const id = usePackingStore.getState().createList('Holiday');
    usePackingStore.getState().deleteList(id);
    const { lists } = usePackingStore.getState();
    expect(lists[id]).toBeUndefined();
  });

  it('sets activeList to another list when active list is deleted', () => {
    const id = usePackingStore.getState().createList('Holiday');
    usePackingStore.getState().setActiveList(id);
    usePackingStore.getState().deleteList(id);
    const { activeList, lists } = usePackingStore.getState();
    expect(activeList).toBeDefined();
    expect(lists[activeList!]).toBeDefined();
  });
});

describe('mergeList', () => {
  it('merges unique items from source into active list', () => {
    const sourceId = usePackingStore.getState().createList('Source');
    usePackingStore.setState((state) => {
      state.lists[sourceId].toPack.push(item('s1', 'Sunscreen'));
    });
    usePackingStore.getState().mergeList(sourceId);
    const { lists, activeList } = usePackingStore.getState();
    expect(lists[activeList!].toPack.some((i) => i.name === 'Sunscreen')).toBe(true);
  });

  it('does not duplicate items already in active list', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    const sourceId = usePackingStore.getState().createList('Source');
    usePackingStore.setState((state) => {
      state.lists[sourceId].toPack.push(item('s1', 'Passport'));
    });
    usePackingStore.getState().mergeList(sourceId);
    const { lists, activeList } = usePackingStore.getState();
    const passports = lists[activeList!].toPack.filter((i) => i.name === 'Passport');
    expect(passports).toHaveLength(1);
  });

  it('does nothing when merging a list into itself', () => {
    usePackingStore.getState().addItem('toPack', item('1', 'Passport'));
    usePackingStore.getState().mergeList('default');
    const { lists } = usePackingStore.getState();
    expect(lists['default'].toPack).toHaveLength(1);
  });
});
