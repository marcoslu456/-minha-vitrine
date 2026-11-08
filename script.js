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

function renderFeaturedCategories() {
    const container = document.getElementById('featuredCategories');
    container.innerHTML = '';

    Object.entries(CAT_DATA).forEach(([name, emoji]) => {
        const card = document.createElement('div');
        card.className = "bg-white min-w-[85px] p-2 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-ml-yellow transition";
        card.innerHTML = `
            <span class="text-xl">${emoji}</span>
            <h3 class="text-[10px] font-semibold text-ml-dark-blue truncate w-full">${name}</h3>
            <button onclick="filterCategory('${name}')" class="bg-ml-yellow text-ml-dark-blue text-[8px] font-bold py-0.5 px-2 rounded-full hover:bg-yellow-300 transition">
                Ver
            </button>
        `;
        container.appendChild(card);
    });
}

function filterCategory(category) {
    const filtered = window.allProducts.filter(p => p.category === category);
    renderProducts(filtered);
    document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-10 text-gray-500 font-light">Nenhum produto encontrado 😕</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col";

        // Lógica de imagem: Se não tiver foto, busca o emoji da categoria no CAT_DATA
        const categoryEmoji = CAT_DATA[p.category] || "📦";
        const imageHtml = p.image
            ? `<img src="${p.image}" alt="${p.title}" class="w-full h-36 object-cover">`
            : `<div class="w-full h-36 bg-gray-100 flex items-center justify-center text-4xl">${categoryEmoji}</div>`;

        card.innerHTML = `
            <div class="relative">${imageHtml}</div>
            <div class="p-2 flex flex-col flex-grow">
                <span class="text-[9px] font-bold text-ml-blue uppercase mb-0.5">${p.category}</span>
                <h3 class="text-xs font-medium text-gray-800 mb-2 line-clamp-2 h-8">${p.title}</h3>
                <a href="${p.url}" target="_blank"
                   class="mt-auto block text-center bg-ml-yellow hover:bg-yellow-300 text-ml-dark-blue text-[10px] font-bold py-2 rounded-lg transition">
                   Ver no Mercado Livre
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

loadProducts();
