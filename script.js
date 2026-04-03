document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.getElementById('sortable-list');
    
    // Configuração Supabase
    const supabaseUrl = 'https://vhhsceypsnpyrkotnwfj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHNjZXlwc25weXJrb3Rud2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTUyNzAsImV4cCI6MjA5MDgzMTI3MH0.WxnH4shz-0p7tBIJQRNubKGvOSk0DX7cDyoGY2YXPMw';
    
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Initial default layout config
    const rawDefaultData = [
        "CT_P5K_ADEPRINT_BANDA_ESTREITA_METAL_M2_PT200_01_02_24_ICC_CA",
        "CT_P5K_ADEPRINT_BANDA_ESTREITA_PIGMENTADO_M2_PT200_01_02_24_ICC_CA",
        "CT_P5K_ALBERTO_SA_SCHIAVI_NEWDOT_EXTERNA_PE_PIGMENTADO_M2_PT200_26_10_23",
        "CT_P5K_ALBERTO_SA_SCHIAVI_NEWDOT_EXTERNA_TRANSPARENTE_M2_PT200_26_10_23",
        "CT_P5K_ALBERTO_SA_SCHIAVI_NEWDOT_INTERNA_TRANSPARENTE_M2_PT200_26_10_23",
        "CT_P5K_ALBERTO_SA_UTECO_6_CORES_TRANSP_PIG_M2_PT200_100621_ICC_CA",
        "CT_P5K_ARTE_SOLUCOES_GENERICO_CRYSTALCRS07_EXTERNA_TRANSP_E_PIG_M2_PT200_02_10_24*",
        "CT_P5K_BELPLAS_FEVA_MAQ8F01_NEWDOT_TODOS_FILMES_M2_PT200_01_03_2021",
        "CT_P5K_CARRPLAST_RAFIA_M2_PT200_100522_REVISADA_M2",
        "CT_P5K_CARRPLAST_RAFIA_M2_PT200_100522_REVISAD_M2",
        "CT_P5K_CENTERPLAST_COMEXI218_CRYSTALCRS09_TRANSPARENTES_INTERNA_012026_M2_PT200 * CONFERIDO",
        "CT_P5K_CLICHEART_M2_PT200_14Det_010321",
        "CT_P5K_CPACK_INFINIT_AD_PEPIG_M2_PT200_270723",
        "CT_P5K_CPACK_INFINIT_METAL_COM_BRANCO_M2_PT200_270723",
        "CT_P5K_CPACK_NEWDOT_METAL_COM_BRANCO_M2_PT200_120623",
        "CT_P5K_CPACK_NEWDOT_PE_PIG_M2_PT200_120623",
        "CT_P5K_CPACK_NEWDOT_TRANSP_COM_BRANCO_M2_PT200_120623",
        "CT_P5K_CPACK_NILPETER_CRYSTALCRS04_METAL_M2_PT200_07_01_25*",
        "CT_P5K_CPACK_NILPETER_CRYSTALCRS04_PIGMENT_M2_PT200_07_01_25*",
        "CT_P5K_CPACK_NILPETER_CRYSTALCRS04_TRANSPARENTES_M2_PT200_07_01_25*",
        "CT_P5K_DAVIPLAST_FLEXOPOWER_NEWDOT_TRANSP_E_PIG_220623*",
        "CT_P5K_DAVIPLAST_FLEXOTECH_NEWDOT_TRANSP_PIG_M2_PT200_100321_ICC_CA",
        "CT_P5K_DOKAPACK_PIGMENTADO_TRANS_M2_PT200_090621_ICC_CA",
        "CT_P5K_EMCASA_NEWDOT_BOPP_PEROLA_COMEXI_M2_PT200_25_05_23",
        "CT_P5K_EMCASA_NEWDOT_TRANSP_E_PIG_COMEXI_M2_PT200_25_05_23",
        "CT_P5K_FRITZ_BETAFLEX_NEWDOT_MATTE_INTERNA_M2_PT200_110823",
        "CT_P5K_FRITZ_BETAFLEX_NEWDOT_TRANSP_EXTERNA_M2_PT200_110823",
        "CT_P5K_FRITZ_BETAFLEX_NEWDOT_TRANSP_INTERNA_M2_PT200_110823",
        "CT_P5K_FRITZ_BIELONI_NEWDOT_MATTE_INTERNA_M2_PT200_110823",
        "CT_P5K_FRITZ_BIELONI_NEWDOT_TRANSP_EXTERNA_M2_PT200_110823",
        "CT_P5K_FRITZ_BIELONI_NEWDOT_TRANSP_INTERNA_M2_PT200_110823",
        "CT_P5K_GAYAPLAS_FLEXOTECH_8_CORES_CRYSTALCRS04_TRANSP_E_PIG_191124_M2_PT200",
        "CT_P5K_GESOPLAST_NEWDOT_MATTE_M2_PT200_050923",
        "CT_P5K_GESOPLAST_NEWDOT_TRANSPARENTES_E_PIG_M2_PT200_050923",
        "CT_P5K_GOLDEN_ETIQUETAS_BANDA_ESTREITA_TODOS_FILMES_M2_PT200_15_08_24_ICC_CA",
        "CT_P5K_GRAFAPLAST_PE_PIGMENTADO_M2_PT200_040321_ICC_CA",
        "CT_P5K_GRAFAPLAST_TRANSPARENTE_M2_PT200_040321_ICC_CA",
        "CT_P5K_INDUFLEX_CRYSTALCRS04_PIGMENTADO_EXTERNA_M2_PT200_12_02_25",
        "CT_P5K_INDUFLEX_CRYSTALCRS04_TRANSP_EXTERNA_M2_PT200_12_02_25",
        "CT_P5K_INPLAC_ENGRENADAS_INFINIT_TODOS_FILMES_032021",
        "CT_P5K_INPLAC_ENGRENADAS_NEWDOT_TODOS_FILMES_032021",
        "CT_P5K_INPLAC_ENGRENADAS_NEWDOT_TODOS_FILMES_032021_TINTA_RESISTENTE",
        "CT_P5K_INPLAC_FLEXO_ONE_BRILHO_INFINIT",
        "CT_P5K_INPLAC_FLEXO_ONE_BRILHO_NEWDOT",
        "CT_P5K_INPLAC_GEARLESS_CRYSTALCRS04_TRANSP_E_PIG_M2_PT200_10_01_25",
        "CT_P5K_INPLAC_GEARLESS_INFINITAD_TRANSP_E_PIG_M2_PT200_10_01_25",
        "CT_P5K_IPLAMM_GENERICA_NEWDOT_EXTERNA_PE_PIGMENTADO_M2_PT200_26_10_23",
        "CT_P5K_IPLAMM_GENERICA_NEWDOT_EXTERNA_TRANSP_M2_PT200_26_10_23",
        "CT_P5K_JOVIVA_DIGITAL_FLEXOPOWER_FLEX01_8CORES_PAPEL_M2_PT200_25_10_24",
        "CT_P5K_JOVIVA_DIGITAL_FLEXOPOWER_FLEX04_6CORES_PAPEL_M2_PT200_25_10_24",
        "CT_P5K_LAMITEC_SCHOCKFLEX_CRYSTALCRS09_TRANSPARENTES_09_2025_M2_PT200",
        "CT_P5K_LAMITEC_UTECO_6_CORES_NEWDOT_INTERNA_TRANSP_E_PIG_M2_PT200_10_01_24",
        "CT_P5K_LINER_CARNEVALLI_NEWDOT_2023_INTERNA_M2_PT200_070323",
        "CT_P5K_LINER_COLORFLEX_NEWDOT_2022_TODOS_M2_PT200_020922_ICC_CA",
        "CT_P5K_LINER_START_IFLEXC1000_G4_CRYSTALCRS05_PIG_EXTERNA_M2_PT200_21_05_25",
        "CT_P5K_LINER_START_IFLEXC1000_G4_CRYSTALCRS05_TRANSP_INT_AJUST_02_2026",
        "CT_P5K_LINER_START_IFLEXC1000_G4_CRYSTALCRS05_TRANSP_INT_M2_PT200_21_05_25",
        "CT_P5K_MIRAPLAST_FLEXOTECH_SLEEV_8CORES_CRYSTAL_PIGMENTADOS_M2_PT200_10_09_25",
        "CT_P5K_MIRAPLAST_NEWDOT_TRANSP_PIGMENTADO_M2_PT200_070125",
        "CT_P5K_MIRAPLAST_NEWDOT_TRANSP_PIG_M2_PT200_240621_ICC_CA",
        "CT_P5K_MULTIPRINT_GENERICO_CRYSTALCRS04_METAL_M2_PT200_06_11_24",
        "CT_P5K_MULTIPRINT_GENERICO_CRYSTALCRS04_PIGMENTADOS_M2_PT200_06_11_24",
        "CT_P5K_NINUS_PE_PIGMENTADO_M2_PT200_040321_ICC_CA",
        "CT_P5K_NINUS_PE_TRANSPARENTE_M2_PT200_040321_ICC_CA",
        "CT_P5K_NINUS_PP_TRANSPARENTE_M2_PT200_040321_ICC_CA",
        "CT_P5K_NOBRE_BETAFLEX03_6CORES_CRYSTAL_INTERNA_MATTE_MC225_M2_PT200_07_07_25 CONFERIDO",
        "CT_P5K_NOBRE_BETAFLEX03_6CORES_CRYSTAL_INTERNA_TRANSP_MC225_M2_PT200_07_07_25 CONFERIDO",
        "CT_P5K_NOBRE_PEQUENA02_8CORES_CRYSTAL_INTERNA_MATTE_MC225_M2_PT200_07_07_25 CONFERIDO",
        "CT_P5K_NOBRE_PEQUENA02_8CORES_CRYSTAL_INTERNA_TRANSP_MC225_M2_PT200_07_07_25 CONFERIDO OK",
        "CT_P5K_NOBRE_REINAFLEX_CRYSTAL_INTERNA_MATTE_MC225_M2_PT200_09_04_25 CONFERIDO OK",
        "CT_P5K_NOBRE_REINAFLEX_CRYSTAL_INTERNA_TRANSP_MC225_M2_PT200_09_04_25 CONFERIDO OK",
        "CT_P5K_PAPEL_SAO_JOAO_CRYSTALCRS10_M2_PT200_09_06_25",
        "CT_P5K_PAPEL_SAO_JOAO_INFINIT_AD_M2_PT200_260722",
        "CT_P5K_PARNAPLAST_INFINIT_TRANS_PIGMENTADO_M2_PT200_180621_ICC_CA",
        "CT_P5K_PARNAPLAST_NEWDOT_TRANS_PIGMENTADO_M2_PT200_180621_ICC_CA",
        "CT_P5K_PHILIBRAS_NEWDOT_TODOS_FILMES_10_2022",
        "CT_P5K_PLASTFORT_FLEXOONE_GEARLESS_8_CORES_CRYSTALCRS12_TRANSP_E_PIG_102025_M2_PT200",
        "CT_P5K_PLASTIART_FLEXOTECH_CRYSTAL_TRANSPARENTE_PIGMENTADO_M2_PT200_05_05_25",
        "CT_P5K_PLASZOM_COMEXI_CRYSTALCRS09_BOPP_PET_TRANSP_012026_M2_PT200",
        "CT_P5K_PLASZOM_COMEXI_CRYSTALCRS09_MATTE_012026_M2_PT200",
        "CT_P5K_PLASZOM_COMEXI_CRYSTALCRS09_PE_TRANSP_012026_M2_PT200",
        "CT_P5K_REGAPLAST_BETAFLEX_CRYSTALCRS09_TRANSP_E_PIG_102025_M2_PT200",
        "CT_P5K_REGAPLAST_THUNDER_CRYSTALCRS09_TRANSP_E_PIG_102025_M2_PT200",
        "CT_P5K_RL_PLAST_BETAFLEX_CRYSTALCRS09_MATTE_M2_PT200_09_04_25",
        "CT_P5K_RL_PLAST_BETAFLEX_CRYSTALCRS09_TRANSPARENTES_M2_PT200_09_04_25",
        "CT_P5K_RL_PLAST_BIELLONI_CRYSTALCRS12_MATTE_M2_PT200_09_04_25",
        "CT_P5K_RL_PLAST_BIELLONI_CRYSTALCRS12_TRANSPARENTES_M2_PT200_09_04_25",
        "CT_P5K_ROTOFLEX_PIGMENTADO_M2_PT200_040321_ICC_CA",
        "CT_P5K_ROTOFLEX_TRANSPARENTE_M2_PT200_040321_ICC_CA",
        "CT_P5K_RUPLAST_COMEXIF2_MAQ08_NEWDOT_EXTERNA_BOPP_PEROLA_M2_PT200_20_10_23",
        "CT_P5K_RUPLAST_COMEXIF2_MAQ08_NEWDOT_EXTERNA_METALIZADO_M2_PT200_20_10_23",
        "CT_P5K_RUPLAST_COMEXIF2_MAQ08_NEWDOT_EXTERNA_PEPIG_M2_PT200_20_10_23",
        "CT_P5K_RUPLAST_COMEXIF2_MAQ08_NEWDOT_EXTERNA_TRANSP_M2_PT200_20_10_23",
        "CT_P5K_RUPLAST_COMEXIF2_MAQ08_NEWDOT_INTERNA_TRANSP_M2_PT200_20_10_23",
        "CT_P5K_RUPLAST_FLEXOONE_CRYSTALCRS09_TRANSPARENTES_022026_M2_PT200",
        "CT_P5K_SERVIPLAS_FEVA_8_CORES_CRYSTALCRS09_MATTE_102025_M2_PT200",
        "CT_P5K_SERVIPLAS_FEVA_8_CORES_CRYSTALCRS09_TRANSP_E_PIG_102025_M2_PT200",
        "CT_P5K_SERVIPLAS_FLEXOTECH_CRYSTALCRS09_MATTE_M2_PT200",
        "CT_P5K_SERVIPLAS_FLEXOTECH_CRYSTALCRS09_TRANSP_M2_PT200",
        "CT_P5K_SOMAR_FLEXOPOWER_INFINIT_AD_GEARLESS_TODOS_FILMES_10_2022",
        "CT_P5K_SOMAR_FLEXOPOWER_NEWDOT_GEARLESS_TODOS_FILMES_10_2022 CONFERIDO OK",
        "CT_P5K_SOMAR_FLEXOTECH_GEARLESS_CRYSTALCRS04_TRANSP_E_PIG_09_2025_M2_PT200 CONFERIDO OK",
        "CT_P5K_SOMAR_FLEXOTECH_NEWDOT_TRANSP_E_PIG_M2_PT200_040321_ICC_CA",
        "CT_P5K_VIVA_FLEXOPOWERZETA8_CRYSTALCRS12_PIGMENTADOS_EXTERNA_012026_M2_PT200",
        "CT_P5K_PLASC_PE_PIGMENTADO_2025"
    ];

    const defaultData = rawDefaultData.map(item => {
        const isChecked = item.includes('CONFERIDO') || item.includes('CONFERIDO OK');
        const cleanName = item.replace(/\*?\s*CONFERIDO\s*(OK)?/gi, '').trim();
        return { name: cleanName, checked: isChecked };
    });

    let priorities = [];
    const searchInput = document.getElementById('searchInput');
    let sortableInstance = null;
    let isEditingDB = false;

    // Loading data from Supabase
    async function loadData() {
        const { data, error } = await supabase
            .from('priorities')
            .select('*')
            .order('order_index', { ascending: true });

        if (error || !data) {
            console.error('Erro ao buscar dados do Supabase ou Tabela Vazia. Verifique a criacao da tabela: setup.sql');
            
            // Local fallback se a tabela der erro fatal ou não existir
            priorities = defaultData.map((d, i) => ({ ...d, id: null, order_index: i }));
            
            // Joga os marcados para cima visualmente
            priorities.sort((a,b) => (a.checked === b.checked) ? 0 : a.checked ? -1 : 1);
            
        } else if (data.length === 0) {
            console.log("Banco de dados Supabase vazio! Sincronizando modelo padrao...");
            listEl.innerHTML = '<li class="list-item" style="justify-content:center;">Inicializando banco de dados pela primeira vez... aguarde.</li>';
            
            // Pede que ordenemos os Checked primeiro
            let initialPayload = defaultData.map((d) => ({ ...d }));
            initialPayload.sort((a,b) => (a.checked === b.checked) ? 0 : a.checked ? -1 : 1);
            
            const insertPayload = initialPayload.map((item, idx) => ({
                name: item.name,
                checked: item.checked,
                order_index: idx
            }));

            const { data: insertedData, error: insError } = await supabase
                .from('priorities')
                .insert(insertPayload)
                .select();
            
            if (!insError && insertedData) {
                priorities = insertedData;
                priorities.sort((a, b) => a.order_index - b.order_index); // garante visual do sort
            } else {
                console.error("Erro ao popular tabela:", insError);
                priorities = insertPayload;
            }
        } else {
            // Already has data from Supabase!
            priorities = data;
            
            // Migration para o item 105 ou outros se o DB ja existir mas estiver incompleto
            if (data.length < defaultData.length) {
                const diff = defaultData.length - data.length;
                const newItems = defaultData.slice(-diff).map((item, idx) => ({
                    name: item.name,
                    checked: item.checked,
                    order_index: data.length + idx
                }));
                const { data: inserted, error: e } = await supabase.from('priorities').insert(newItems).select();
                if (!e && inserted) priorities.push(...inserted);
            }
        }
        renderList();
    }

    // Debounce to prevent unnecessary saves
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Atualiza individualmente o banco
    async function saveItem(id, updates) {
        if (!id) return;
        isEditingDB = true;
        await supabase.from('priorities').update(updates).eq('id', id);
        isEditingDB = false;
    }

    // Atualiza a ordem do array inteiro (Bulk Update) no Supabase
    async function saveOrderBulk() {
        isEditingDB = true;
        
        // Supabase REST client doesn't support generic batch upsert nicely with varied data unless using RPC
        // Since list is only 105 elements, we can do multiple small async requests ou usar upsert passsando os Ids
        const payloadToUpsert = priorities.map((p, index) => ({
            id: p.id,
            name: p.name,
            checked: p.checked,
            order_index: index  // Nova posicao real
        }));
        
        await supabase.from('priorities').upsert(payloadToUpsert);
        isEditingDB = false;
    }

    // Sync input typing
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
                <input type="number" class="item-index-input" value="${index + 1}" data-index="${index}" min="1" max="${priorities.length}" title="Mude o número e aperte OK/Enter ou tire o foco para mover de posição.">
                <div class="item-checkbox-wrapper" title="Marcar como conferido">
                    <input type="checkbox" class="item-checkbox" data-index="${index}" ${checkedAttr}>
                </div>
                <div class="item-content">
                    <input type="text" class="item-input ${checkedClass}" value="${safeValue}" data-index="${index}">
                </div>
            `;
            listEl.appendChild(li);
        });

        // Event for text edit
        document.querySelectorAll('.item-input').forEach(input => {
            input.addEventListener('input', handleInput);
        });

        // Event for checkbox
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                priorities[idx].checked = e.target.checked;
                saveItem(priorities[idx].id, { checked: e.target.checked });
                renderList(searchInput.value);
            });
        });

        // Event listener for numeric move
        document.querySelectorAll('.item-index-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const oldIdx = parseInt(e.target.getAttribute('data-index'), 10);
                let newIdx = parseInt(e.target.value, 10) - 1;
                
                if (isNaN(newIdx) || newIdx < 0) newIdx = 0;
                if (newIdx >= priorities.length) newIdx = priorities.length - 1;

                if (oldIdx !== newIdx) {
                    const item = priorities.splice(oldIdx, 1)[0];
                    priorities.splice(newIdx, 0, item);
                    saveOrderBulk(); // save massive indices change
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

    // Setup Sortable
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

    // Subscrição do Tempo Real
    supabase
        .channel('public:priorities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'priorities' }, (payload) => {
            // Se outra pessoa atualizar (não fomos nós)
            if (!isEditingDB) {
                console.log('Detectado mudança no servidor, atualizando...');
                loadData();
            }
        })
        .subscribe();

    // Start DB Loading
    loadData();
});
