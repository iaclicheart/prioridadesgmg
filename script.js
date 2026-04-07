document.addEventListener('DOMContentLoaded', async () => {

    const FILIAIS = ['Matriz', 'Pomerode', 'Nordeste'];
    const supabaseUrl = 'https://vhhsceypsnpyrkotnwfj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHNjZXlwc25weXJrb3Rud2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTUyNzAsImV4cCI6MjA5MDgzMTI3MH0.WxnH4shz-0p7tBIJQRNubKGvOSk0DX7cDyoGY2YXPMw';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    let priorities = [];
    let isEditingDB = false;
    let isLoading = false;
    const searchInput = document.getElementById('searchInput');
    const sortableInstances = {};

    // Returns items for a filial, sorted by order_index
    function getItems(filial, filterText = '') {
        const lowerFilter = filterText.toLowerCase();
        return priorities
            .filter(p => (p.filial || 'Matriz') === filial)
            .filter(p => !lowerFilter || p.name.toLowerCase().includes(lowerFilter))
            .sort((a, b) => a.order_index - b.order_index);
    }

    // Load all data from Supabase (read-only seed — no auto-insert)
    async function loadData() {
        if (isLoading) return;
        isLoading = true;
        const { data, error } = await supabase
            .from('priorities')
            .select('*')
            .order('order_index', { ascending: true });

        if (!error && data) {
            priorities = data;
            renderAll();
        } else if (error) {
            console.error('Erro Supabase:', error);
        }
        isLoading = false;
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Save a single field update for one item
    async function saveItem(id, updates) {
        if (!id) return;
        isEditingDB = true;
        await supabase.from('priorities').update(updates).eq('id', id);
        setTimeout(() => { isEditingDB = false; }, 600);
    }

    // Bulk save order_index for all items in a filial
    async function saveFilialOrder(filial) {
        const items = priorities
            .filter(p => (p.filial || 'Matriz') === filial)
            .sort((a, b) => a.order_index - b.order_index);

        const payload = items.map((p, idx) => ({
            id: p.id,
            name: p.name,
            checked: p.checked,
            filial: p.filial || 'Matriz',
            order_index: idx
        }));

        // Update local too
        payload.forEach(pl => {
            const local = priorities.find(x => x.id === pl.id);
            if (local) local.order_index = pl.order_index;
        });

        await supabase.from('priorities').upsert(payload);
    }

    // Text edit handler (debounced)
    const handleInput = debounce((e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const item = priorities.find(p => p.id === id);
        if (item) {
            item.name = e.target.value;
            saveItem(id, { name: e.target.value });
        }
    }, 500);

    // Render a single column
    function renderColumn(filial, filterText = '') {
        const ul = document.getElementById(`list-${filial}`);
        const countEl = document.getElementById(`count-${filial}`);
        if (!ul) return;

        ul.innerHTML = '';
        const items = getItems(filial, filterText);
        if (countEl) countEl.textContent = items.length;

        if (items.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-column-msg';
            empty.innerHTML = '<i class="fas fa-inbox" style="margin-right:0.4rem;"></i>Arraste itens para cá';
            ul.appendChild(empty);
            return;
        }

        items.forEach((item, colIndex) => {
            const li = document.createElement('li');
            li.className = 'list-item';
            li.setAttribute('data-id', item.id);

            const safeValue = item.name.replace(/"/g, '&quot;');
            const checkedAttr = item.checked ? 'checked' : '';
            const checkedClass = item.checked ? 'item-checked' : '';

            li.innerHTML = `
                <div class="drag-handle" title="Arraste para reordenar ou mover entre filiais">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <input type="number" class="item-index-input" value="${colIndex + 1}" data-id="${item.id}" data-filial="${filial}" min="1" max="${items.length}" title="Mude o número e pressione Enter para mover">
                <div class="item-checkbox-wrapper" title="Marcar como conferido">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${checkedAttr}>
                </div>
                <div class="item-content">
                    <input type="text" class="item-input ${checkedClass}" value="${safeValue}" data-id="${item.id}">
                </div>
                <button class="delete-btn" data-id="${item.id}" title="Excluir este perfil">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            ul.appendChild(li);
        });

        // --- Event Listeners ---

        ul.querySelectorAll('.item-input').forEach(input => {
            input.addEventListener('input', handleInput);
        });

        ul.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = priorities.find(p => p.id === id);
                if (item) {
                    item.checked = e.target.checked;
                    await saveItem(id, { checked: e.target.checked });
                }
                renderAll(searchInput.value);
            });
        });

        ul.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const item = priorities.find(p => p.id === id);
                if (!item || !confirm(`Excluir "${item.name}"?`)) return;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                const { error } = await supabase.from('priorities').delete().eq('id', id);
                if (!error) {
                    priorities = priorities.filter(p => p.id !== id);
                    renderAll(searchInput.value);
                } else {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                }
            });
        });

        ul.querySelectorAll('.item-index-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const filialOfItem = e.target.getAttribute('data-filial');
                const colItems = getItems(filialOfItem);
                const oldIdx = colItems.findIndex(p => p.id === id);
                let newIdx = parseInt(e.target.value, 10) - 1;
                if (isNaN(newIdx) || newIdx < 0) newIdx = 0;
                if (newIdx >= colItems.length) newIdx = colItems.length - 1;

                if (oldIdx !== newIdx) {
                    const moved = colItems.splice(oldIdx, 1)[0];
                    colItems.splice(newIdx, 0, moved);
                    colItems.forEach((p, idx) => {
                        const local = priorities.find(x => x.id === p.id);
                        if (local) local.order_index = idx;
                    });
                    isEditingDB = true;
                    saveFilialOrder(filialOfItem).then(() => {
                        setTimeout(() => { isEditingDB = false; }, 600);
                    });
                    renderAll(searchInput.value);
                }
            });
        });
    }

    // Render all 3 columns
    function renderAll(filterText = '') {
        const hasFilter = !!filterText;
        FILIAIS.forEach(f => {
            renderColumn(f, filterText);
            if (sortableInstances[f]) {
                sortableInstances[f].option('disabled', hasFilter);
            }
        });
    }

    // Setup SortableJS — all 3 lists share the same group for cross-column dragging
    FILIAIS.forEach(filial => {
        const ul = document.getElementById(`list-${filial}`);
        if (!ul) return;

        sortableInstances[filial] = new Sortable(ul, {
            group: 'gmg-priorities',
            animation: 200,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            onEnd: async function (evt) {
                const id = parseInt(evt.item.getAttribute('data-id'));
                const fromFilial = evt.from.getAttribute('data-filial');
                const toFilial = evt.to.getAttribute('data-filial');

                const item = priorities.find(p => p.id === id);
                if (!item) return;

                isEditingDB = true;

                // Update filial if moved between columns
                if (fromFilial !== toFilial) {
                    item.filial = toFilial;
                }

                // Read DOM to get new order for destination column
                const destEls = [...evt.to.querySelectorAll('li[data-id]')];
                destEls.forEach((li, idx) => {
                    const liId = parseInt(li.getAttribute('data-id'));
                    const p = priorities.find(x => x.id === liId);
                    if (p) p.order_index = idx;
                });

                // If cross-column, also update source column order
                if (fromFilial !== toFilial) {
                    const srcEls = [...evt.from.querySelectorAll('li[data-id]')];
                    srcEls.forEach((li, idx) => {
                        const liId = parseInt(li.getAttribute('data-id'));
                        const p = priorities.find(x => x.id === liId);
                        if (p) p.order_index = idx;
                    });
                }

                // Save to DB
                const filialsToSave = fromFilial !== toFilial ? [fromFilial, toFilial] : [toFilial];
                for (const f of filialsToSave) {
                    await saveFilialOrder(f);
                }

                setTimeout(() => { isEditingDB = false; }, 600);
                renderAll(searchInput.value);
            }
        });
    });

    searchInput.addEventListener('input', (e) => renderAll(e.target.value));

    // Add new profile
    const newProfileInput = document.getElementById('newProfileInput');
    const newProfileFilial = document.getElementById('newProfileFilial');
    const addProfileBtn = document.getElementById('addProfileBtn');

    async function addNewProfile() {
        const name = newProfileInput.value.trim();
        const filial = newProfileFilial.value;
        if (!name) return;

        addProfileBtn.disabled = true;
        addProfileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        const colItems = getItems(filial);
        const newOrderIndex = colItems.length;

        const { data, error } = await supabase
            .from('priorities')
            .insert([{ name, checked: false, order_index: newOrderIndex, filial }])
            .select()
            .single();

        if (!error && data) {
            priorities.push(data);
            newProfileInput.value = '';
            renderAll(searchInput.value);
        } else {
            console.error('Erro ao adicionar:', error);
        }

        addProfileBtn.disabled = false;
        addProfileBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
    }

    addProfileBtn.addEventListener('click', addNewProfile);
    newProfileInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNewProfile();
    });

    // Real-time sync (debounced to avoid cascade)
    const debouncedRemoteLoad = debounce(() => {
        if (!isEditingDB) loadData();
    }, 1500);

    supabase
        .channel('public:priorities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'priorities' }, () => {
            if (!isEditingDB) debouncedRemoteLoad();
        })
        .subscribe();

    loadData();
});
