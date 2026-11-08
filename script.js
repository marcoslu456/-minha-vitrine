async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();

        renderProducts(products);
        renderCategories(products);

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.title.toLowerCase().includes(term));
            renderProducts(filtered);
        });

        window.allProducts = products;
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function renderCategories(products) {
    const categories = ['Todos', ...new Set(products.map(p => p.category))];
    const container = document.getElementById('categoryFilters');
    container.innerHTML = '';

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = "cat-btn bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap hover:bg-yellow-100 transition";
        btn.onclick = () => filterCategory(cat);
        container.appendChild(btn);
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
        btn.classList.remove('bg-yellow-400', 'text-gray-900');
        btn.classList.add('bg-white', 'text-gray-600');
        if(btn.innerText === category) {
            btn.classList.add('bg-yellow-400', 'text-gray-900');
            btn.classList.remove('bg-white');
        }
    });
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-10 text-gray-500">Nenhum produto encontrado 😕</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col";
        card.innerHTML = `
            <div class="h-40 overflow-hidden bg-gray-200">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-3 flex flex-col flex-grow">
                <span class="text-[10px] font-bold text-yellow-600 uppercase mb-1">${p.category}</span>
                <h3 class="text-sm font-medium text-gray-800 mb-3 line-clamp-2 h-10">${p.title}</h3>
                <a href="${p.url}" target="_blank"
                   class="mt-auto block text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold py-2 rounded-lg transition">
                   Ver no Mercado Livre
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

loadProducts();