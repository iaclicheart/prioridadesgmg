document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.getElementById('sortable-list');
    
    // Configuração Supabase
    const supabaseUrl = 'https://vhhsceypsnpyrkotnwfj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHNjZXlwc25weXJrb3Rud2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTUyNzAsImV4cCI6MjA5MDgzMTI3MH0.WxnH4shz-0p7tBIJQRNubKGvOSk0DX7cDyoGY2YXPMw';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    let priorities = [];
    const searchInput = document.getElementById('searchInput');
    let sortableInstance = null;
    let isEditingDB = false;
    let isLoading = false;

    // Carrega dados do Supabase — SOMENTE LEITURA, nunca insere automaticamente
    async function loadData() {
        if (isLoading) return;
        isLoading = true;

        const { data, error } = await supabase
            .from('priorities')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Erro ao buscar dados do Supabase:', error);
            listEl.innerHTML = '<li class="list-item" style="justify-content:center;color:#f87171;">Erro ao conectar com o banco. Verifique sua conexão.</li>';
        } else if (!data || data.length === 0) {
            listEl.innerHTML = '<li class="list-item" style="justify-content:center;color:#fbbf24;">Banco vazio. Execute seed.mjs para popular os dados.</li>';
        } else {
            priorities = data;
            renderList();
        }
        isLoading = false;
    }

    // Debounce para evitar saves desnecessários
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Atualiza um item individualmente no banco
    async function saveItem(id, updates) {
        if (!id) return;
        isEditingDB = true;
        await supabase.from('priorities').update(updates).eq('id', id);
        setTimeout(() => { isEditingDB = false; }, 500);
    }

    // Atualiza a ordem do array inteiro (Bulk Update) no Supabase
    async function saveOrderBulk() {
        isEditingDB = true;
        const payloadToUpsert = priorities.map((p, index) => ({
            id: p.id,
            name: p.name,
            checked: p.checked,
            order_index: index
        }));
        await supabase.from('priorities').upsert(payloadToUpsert);
        setTimeout(() => { isEditingDB = false; }, 500);
    }

    // Sync input typing com debounce
    const handleInput = debounce((e) => {
        const idx = e.target.getAttribute('data-index');
        priorities[idx].name = e.target.value;
        saveItem(priorities[idx].id, { name: e.target.value });
    }, 500);

    function renderList(filterText = '') {
        listEl.innerHTML = '';
        const lowerFilter = filterText.toLowerCase();

        priorities.forEach((item, index) => {
            if (lowerFilter && !item.name.toLowerCase().includes(lowerFilter)) {
                return;
            }

            const li = document.createElement('li');
            li.className = 'list-item';
            
            const safeValue = item.name.replace(/"/g, '&quot;');
            const checkedAttr = item.checked ? 'checked' : '';
            const checkedClass = item.checked ? 'item-checked' : '';

            li.innerHTML = `
                <div class="drag-handle" title="Arraste para reordenar">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <input type="number" class="item-index-input" value="${index + 1}" data-index="${index}" min="1" max="${priorities.length}" title="Mude o número e aperte Enter para mover de posição.">
                <div class="item-checkbox-wrapper" title="Marcar como conferido">
                    <input type="checkbox" class="item-checkbox" data-index="${index}" ${checkedAttr}>
                </div>
                <div class="item-content">
                    <input type="text" class="item-input ${checkedClass}" value="${safeValue}" data-index="${index}">
                </div>
            `;
            listEl.appendChild(li);
        });

        // Editar nome
        document.querySelectorAll('.item-input').forEach(input => {
            input.addEventListener('input', handleInput);
        });

        // Checkbox conferido
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                priorities[idx].checked = e.target.checked;
                saveItem(priorities[idx].id, { checked: e.target.checked });
                renderList(searchInput.value);
            });
        });

        // Mover por número
        document.querySelectorAll('.item-index-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const oldIdx = parseInt(e.target.getAttribute('data-index'), 10);
                let newIdx = parseInt(e.target.value, 10) - 1;
                
                if (isNaN(newIdx) || newIdx < 0) newIdx = 0;
                if (newIdx >= priorities.length) newIdx = priorities.length - 1;

                if (oldIdx !== newIdx) {
                    const item = priorities.splice(oldIdx, 1)[0];
                    priorities.splice(newIdx, 0, item);
                    saveOrderBulk();
                    renderList(searchInput.value);
                } else {
                    e.target.value = oldIdx + 1;
                }
            });
        });

        if (sortableInstance) {
            sortableInstance.option('disabled', !!lowerFilter);
        }
    }

    // Setup Sortable drag-and-drop
    sortableInstance = new Sortable(listEl, {
        animation: 200,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onEnd: function (evt) {
            const item = priorities.splice(evt.oldIndex, 1)[0];
            priorities.splice(evt.newIndex, 0, item);
            saveOrderBulk();
            renderList(searchInput.value);
        }
    });

    searchInput.addEventListener('input', (e) => {
        renderList(e.target.value);
    });

    // Adicionar novo perfil
    const newProfileInput = document.getElementById('newProfileInput');
    const addProfileBtn = document.getElementById('addProfileBtn');

    async function addNewProfile() {
        const name = newProfileInput.value.trim();
        if (!name) return;

        addProfileBtn.disabled = true;
        addProfileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        const newOrderIndex = priorities.length;
        const { data, error } = await supabase
            .from('priorities')
            .insert([{ name, checked: false, order_index: newOrderIndex }])
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar perfil:', error);
            addProfileBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro!';
            setTimeout(() => {
                addProfileBtn.disabled = false;
                addProfileBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
            }, 2000);
        } else {
            priorities.push(data);
            newProfileInput.value = '';
            renderList(searchInput.value);
            addProfileBtn.disabled = false;
            addProfileBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
            // Rola para o final para mostrar o novo item
            listEl.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    addProfileBtn.addEventListener('click', addNewProfile);
    newProfileInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNewProfile();
    });

    // Tempo Real — debounced para evitar recargas em cascata
    const debouncedRemoteLoad = debounce(() => {
        if (!isEditingDB) {
            loadData();
        }
    }, 1500);

    supabase
        .channel('public:priorities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'priorities' }, () => {
            if (!isEditingDB) {
                debouncedRemoteLoad();
            }
        })
        .subscribe();

    // Carrega os dados
    loadData();
});
