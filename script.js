const CAT_DATA = {
    "Eletrônicos": "📱",
    "Casa": "🏠",
    "Beleza": "💄",
    "Moda": "👕",
    "Esporte e Lazer": "⚽"
};

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        window.allProducts = products;

        renderProducts(products);
        renderCategories(products);
        renderFeaturedCategories();

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.title.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function executeSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.allProducts.filter(p => p.title.toLowerCase().includes(term));
    renderProducts(filtered);
}

function renderCategories(products) {
    const categories = ['Todos', ...new Set(products.map(p => p.category))];
    const container = document.getElementById('categoryFilters');
    container.innerHTML = '';

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = `cat-btn px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap shadow-sm ${cat === 'Todos' ? 'bg-ml-blue text-white' : 'bg-white text-gray-600 border border-gray-200'}`;
        btn.onclick = () => filterCategory(cat);
        container.appendChild(btn);
    });
}

// ESTA É A FUNÇÃO QUE FOI REDUZIDA:
function renderFeaturedCategories() {
    const container = document.getElementById('featuredCategories');
    container.innerHTML = '';

    Object.entries(CAT_DATA).forEach(([name, emoji]) => {
        const card = document.createElement('div');
        // Aqui estão os tamanhos menores: p-3, rounded-xl
        card.className = "bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-ml-yellow transition";
        card.innerHTML = `
            <span class="text-2xl">${emoji}</span>
            <h3 class="text-xs font-semibold text-ml-dark-blue">${name}</h3>
            <button onclick="filterCategory('${name}')" class="bg-ml-yellow text-ml-dark-blue text-[9px] font-bold py-1 px-2 rounded-full flex items-center gap-1 hover:bg-yellow-300 transition">
                🛒 Ver
            </button>
        `;
        container.appendChild(card);
    });
}

function filterCategory(category) {
    if (category === 'Todos') {
        renderProducts(window.allProducts);
    } else {
        const filtered = window.allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }

    document.querySelectorAll('.cat-btn').forEach(btn => {
        if(btn.innerText === category) {
            btn.className = "cat-btn px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap shadow-sm bg-ml-blue text-white";
        } else {
            btn.className = "cat-btn px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap shadow-sm bg-white text-gray-600 border border-gray-200";
        }
    });

    document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-10 text-gray-500 font-light">Nenhum produto encontrado nesta categoria 😕</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col";

        const imageHtml = p.image
            ? `<img src="${p.image}" alt="${p.title}" class="w-full h-44 object-cover">`
            : `<div class="w-full h-44 bg-gray-100 flex items-center justify-center text-4xl">📦</div>`;

        card.innerHTML = `
            <div class="relative">${imageHtml}</div>
            <div class="p-3 flex flex-col flex-grow">
                <span class="text-[10px] font-bold text-ml-blue uppercase mb-1">${p.category}</span>
                <h3 class="text-sm font-medium text-gray-800 mb-3 line-clamp-2 h-10">${p.title}</h3>
                <a href="${p.url}" target="_blank"
                   class="mt-auto block text-center bg-ml-yellow hover:bg-yellow-300 text-ml-dark-blue text-xs font-bold py-2.5 rounded-xl transition">
                   Ver no Mercado Livre
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

loadProducts();
