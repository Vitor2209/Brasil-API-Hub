/**
 * Brasil API Hub - Script.js
 * Pure JavaScript - ES6+
 * No Libraries or Frameworks
 */

// ================================
// Configuration
// ================================
const API_BASE_URL = 'http://localhost:8080/api';

// Brazilian States Data
const ESTADOS_BRASIL = [
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'GO', nome: 'Goiás' }
];

// State SVG Paths (simplified representations)
const ESTADO_PATHS = {
    'MG': 'M10,5 L50,5 L60,25 L55,45 L30,55 L5,40 L10,5 Z',
    'BA': 'M15,5 L55,10 L60,35 L45,55 L15,50 L5,30 L15,5 Z',
    'SP': 'M10,15 L55,10 L60,35 L50,50 L15,55 L5,35 L10,15 Z',
    'RJ': 'M5,20 L50,10 L60,30 L55,50 L20,55 L5,40 L5,20 Z',
    'RS': 'M20,5 L55,15 L60,40 L40,55 L10,50 L5,25 L20,5 Z',
    'PR': 'M5,20 L55,15 L60,35 L50,50 L10,55 L5,35 L5,20 Z',
    'SC': 'M10,15 L55,10 L60,30 L50,50 L15,55 L5,35 L10,15 Z',
    'GO': 'M15,5 L50,10 L55,35 L45,55 L20,55 L5,35 L15,5 Z'
};

// ================================
// DOM Elements Cache
// ================================
const elements = {
    // Theme
    themeToggle: null,
    
    // CEP
    cepInput: null,
    cepBtn: null,
    cepSkeleton: null,
    cepContent: null,
    
    // Feriados
    feriadoAno: null,
    feriadoBtn: null,
    feriadosSkeleton: null,
    feriadosContent: null,
    
    // Dólar
    dolarDisplay: null,
    dolarBtn: null,
    dolarSkeleton: null,
    dolarContent: null,
    
    // Clima
    climaCidade: null,
    climaBtn: null,
    climaSkeleton: null,
    climaContent: null,
    
    // Estados
    estadosGrid: null,
    
    // Toast
    toastContainer: null
};

// ================================
// Initialization
// ================================
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initTheme();
    initEventListeners();
    renderEstados();
});

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    elements.themeToggle = document.getElementById('themeToggle');
    
    elements.cepInput = document.getElementById('cepInput');
    elements.cepBtn = document.getElementById('cepBtn');
    elements.cepSkeleton = document.getElementById('cepSkeleton');
    elements.cepContent = document.getElementById('cepContent');
    
    elements.feriadoAno = document.getElementById('feriadoAno');
    elements.feriadoBtn = document.getElementById('feriadoBtn');
    elements.feriadosSkeleton = document.getElementById('feriadosSkeleton');
    elements.feriadosContent = document.getElementById('feriadosContent');
    
    elements.dolarDisplay = document.getElementById('dolarDisplay');
    elements.dolarBtn = document.getElementById('dolarBtn');
    elements.dolarSkeleton = document.getElementById('dolarSkeleton');
    elements.dolarContent = document.getElementById('dolarContent');
    
    elements.climaCidade = document.getElementById('climaCidade');
    elements.climaBtn = document.getElementById('climaBtn');
    elements.climaSkeleton = document.getElementById('climaSkeleton');
    elements.climaContent = document.getElementById('climaContent');
    
    elements.estadosGrid = document.getElementById('estadosGrid');
    elements.toastContainer = document.getElementById('toastContainer');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Theme Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // CEP
    elements.cepBtn.addEventListener('click', handleCepSearch);
    elements.cepInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCepSearch();
    });
    elements.cepInput.addEventListener('input', formatCepInput);
    
    // Feriados
    elements.feriadoBtn.addEventListener('click', handleFeriadosSearch);
    
    // Dólar
    elements.dolarBtn.addEventListener('click', handleDolarSearch);
    
    // Clima
    elements.climaBtn.addEventListener('click', handleClimaSearch);
}

// ================================
// Theme Management
// ================================
/**
 * Initialize theme from localStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ================================
// CEP Functions
// ================================
/**
 * Format CEP input as user types (00000-000)
 */
function formatCepInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
}

/**
 * Handle CEP search
 */
async function handleCepSearch() {
    const cep = elements.cepInput.value.replace(/\D/g, '');
    
    if (!cep || cep.length !== 8) {
        showToast('Por favor, insira um CEP válido (8 dígitos)', 'error');
        return;
    }
    
    showSkeleton(elements.cepSkeleton, elements.cepContent);
    setButtonLoading(elements.cepBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/cep/${cep}`);
        
        if (!response.ok) {
            throw new Error('CEP não encontrado');
        }
        
        const data = await response.json();
        renderCepResult(data);
    } catch (error) {
        showError(elements.cepContent, elements.cepSkeleton, error.message);
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(elements.cepBtn, false);
    }
}

/**
 * Render CEP search result
 */
function renderCepResult(data) {
    hideSkeleton(elements.cepSkeleton, elements.cepContent);
    
    elements.cepContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">Logradouro:</span>
            <span class="result-value">${data.logradouro || 'N/A'}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Bairro:</span>
            <span class="result-value">${data.bairro || 'N/A'}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Cidade:</span>
            <span class="result-value">${data.localidade || data.cidade || 'N/A'} - ${data.uf || 'N/A'}</span>
        </div>
    `;
}

// ================================
// Feriados Functions
// ================================
/**
 * Handle Feriados search
 */
async function handleFeriadosSearch() {
    const ano = elements.feriadoAno.value;
    
    showSkeleton(elements.feriadosSkeleton, elements.feriadosContent);
    setButtonLoading(elements.feriadoBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/feriados/${ano}`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar feriados');
        }
        
        const data = await response.json();
        renderFeriadosResult(data, ano);
    } catch (error) {
        showError(elements.feriadosContent, elements.feriadosSkeleton, error.message);
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(elements.feriadoBtn, false);
    }
}

/**
 * Render Feriados result
 */
function renderFeriadosResult(data, ano) {
    hideSkeleton(elements.feriadosSkeleton, elements.feriadosContent);
    
    const feriados = Array.isArray(data) ? data : data.feriados || [];
    const displayCount = 3;
    const displayFeriados = feriados.slice(0, displayCount);
    const remainingCount = feriados.length - displayCount;
    
    let html = '<div class="feriados-list">';
    
    displayFeriados.forEach(feriado => {
        const date = formatDate(feriado.date || feriado.data);
        const name = feriado.name || feriado.nome || feriado.title;
        html += `
            <div class="feriado-item">
                <span class="feriado-date">${date}:</span>
                <span class="feriado-name">${name}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (remainingCount > 0) {
        html += `
            <div class="feriados-count">
                <span>+</span>
                <span>${remainingCount} feriados em ${ano}</span>
            </div>
        `;
    }
    
    elements.feriadosContent.innerHTML = html;
}

/**
 * Format date to DD/MM format
 */
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    
    try {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    } catch {
        return dateStr;
    }
}

// ================================
// Dólar Functions
// ================================
/**
 * Handle Dólar search
 */
async function handleDolarSearch() {
    showSkeleton(elements.dolarSkeleton, elements.dolarContent);
    setButtonLoading(elements.dolarBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/dolar`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar cotação');
        }
        
        const data = await response.json();
        renderDolarResult(data);
    } catch (error) {
        showError(elements.dolarContent, elements.dolarSkeleton, error.message);
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(elements.dolarBtn, false);
    }
}

/**
 * Render Dólar result
 */
function renderDolarResult(data) {
    hideSkeleton(elements.dolarSkeleton, elements.dolarContent);

    const venda = Number(data.venda || data.ask || data.cotacao);
    const compra = Number(data.compra || data.bid);

    const formatBRL = (value) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);

    // Valor grande em destaque
    elements.dolarDisplay.innerHTML = `
        <span class="dolar-value">${formatBRL(venda)}</span>
    `;

    elements.dolarContent.innerHTML = `
        <div class="dolar-info">
            <div class="result-item">
                <span class="result-label">Compra:</span>
                <span class="result-value">${formatBRL(compra)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Atualizado:</span>
                <span class="result-value">${formatDateTime(data.data || data.create_date)}</span>
            </div>
        </div>
    `;
}


/**
 * Format datetime string
 */
function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch {
        return dateStr;
    }
}

// ================================
// Clima Functions
// ================================
/**
 * Handle Clima search
 */
async function handleClimaSearch() {
    const cidade = elements.climaCidade.value;

    showSkeleton(elements.climaSkeleton, elements.climaContent);
    setButtonLoading(elements.climaBtn, true);

    try {
        const response = await fetch(
            `${API_BASE_URL}/clima?cidade=${encodeURIComponent(cidade)}`
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar clima');
        }

        const data = await response.json();
        renderClimaResult(data, cidade);

    } catch (error) {
        showError(elements.climaContent, elements.climaSkeleton, error.message);
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(elements.climaBtn, false);
    }
}

/**
 * Render Clima result
 */
function renderClimaResult(data, cidade) {
    hideSkeleton(elements.climaSkeleton, elements.climaContent);
    
    const temp = data.temperatura || data.temp || data.temperature || '--';
    const condicao = data.condicao || data.condition || data.descricao || data.description || 'N/A';
    const umidade = data.umidade || data.humidity || '--';
    
    elements.climaContent.innerHTML = `
        <div class="clima-result">
            <div class="clima-temp">
                <span class="temp-value">${temp}°C</span>
                <span class="temp-condition">${condicao}</span>
            </div>
            <div class="clima-humidity">
                <span class="humidity-icon">💧</span>
                <span>Umidade: ${umidade}%</span>
            </div>
        </div>
    `;
}
// ================================
// Estados Modal Logic
// ================================

// Dados dos estados (pode expandir depois)
const ESTADOS_DETALHES = {
  MG: {
    nome: 'Minas Gerais',
    capital: 'Belo Horizonte',
    img: 'assets/estados/mg.png'
  },
  SP: {
    nome: 'São Paulo',
    capital: 'São Paulo',
    img: 'assets/estados/sp.png'
  },
  RJ: {
    nome: 'Rio de Janeiro',
    capital: 'Rio de Janeiro',
    img: 'assets/estados/rj.png'
  },
  BA: {
    nome: 'Bahia',
    capital: 'Salvador',
    img: 'assets/estados/ba.png'
  },
  RS: {
    nome: 'Rio Grande do Sul',
    capital: 'Porto Alegre',
    img: 'assets/estados/rs.png'
  },
  PR: {
    nome: 'Paraná',
    capital: 'Curitiba',
    img: 'assets/estados/pr.png'
  }
};

// Modal elements
const estadoModal = document.getElementById('estadoModal');
const estadoModalClose = document.getElementById('estadoModalClose');
const estadoModalImage = document.getElementById('estadoModalImage');
const estadoModalName = document.getElementById('estadoModalName');
const estadoModalInfo = document.getElementById('estadoModalInfo');

// Abrir modal
function openEstadoModal(sigla) {
  const estado = ESTADOS_DETALHES[sigla];
  if (!estado) return;

  estadoModalImage.src = estado.img;
  estadoModalName.textContent = estado.nome;
  estadoModalInfo.textContent = `Capital: ${estado.capital}`;

  estadoModal.classList.remove('hidden');
}

// Fechar modal
function closeEstadoModal() {
  estadoModal.classList.add('hidden');
}

// Eventos de fechamento
estadoModalClose.addEventListener('click', closeEstadoModal);

estadoModal.querySelector('.estado-modal-overlay')
  .addEventListener('click', closeEstadoModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeEstadoModal();
});


// ================================
// UI Helper Functions
// ================================
/**
 * Show skeleton loading
 */
function showSkeleton(skeletonEl, contentEl) {
    skeletonEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
}

/**
 * Hide skeleton loading
 */
function hideSkeleton(skeletonEl, contentEl) {
    skeletonEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(contentEl, skeletonEl, message) {
    skeletonEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    contentEl.innerHTML = `<div class="error-message">${message}</div>`;
}

/**
 * Set button loading state
 */
function setButtonLoading(btn, isLoading) {
    btn.disabled = isLoading;
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Carregando...';
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-message">${message}</span>`;
    
    elements.toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ================================
// Export for testing (if needed)
// ================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCepInput,
        formatDate,
        formatDateTime,
        ESTADOS_BRASIL
    };
}
// ================================
// Estados Modal Logic (HTML-driven)
// ================================

document.querySelectorAll('.estado-card').forEach(card => {
  card.addEventListener('click', () => {
    const sigla = card.dataset.sigla;
    const nome = card.dataset.estado;

    const detalhes = ESTADOS_DETALHES[sigla];
    if (!detalhes) return;

    estadoModalImage.src = `./assets/states/${sigla.toLowerCase()}.svg`;
    estadoModalName.textContent = nome;
    estadoModalInfo.textContent = `Capital: ${detalhes.capital}`;

    estadoModal.classList.remove('hidden');
  });
});

// Fechar modal
estadoModalClose.addEventListener('click', () => {
  estadoModal.classList.add('hidden');
});

estadoModal.querySelector('.estado-modal-overlay')
  .addEventListener('click', () => {
    estadoModal.classList.add('hidden');
}); 
document.addEventListener('DOMContentLoaded', () => {
  const estadoModal = document.getElementById('estadoModal');
  const estadoModalClose = document.getElementById('estadoModalClose');
  const estadoModalImage = document.getElementById('estadoModalImage');
  const estadoModalName = document.getElementById('estadoModalName');
  const estadoModalInfo = document.getElementById('estadoModalInfo');
  const overlay = document.querySelector('.estado-modal-overlay');

  const ESTADOS_DETALHES = {
    MG: { nome: 'Minas Gerais', capital: 'Belo Horizonte' },
    SP: { nome: 'São Paulo', capital: 'São Paulo' },
    RJ: { nome: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
    BA: { nome: 'Bahia', capital: 'Salvador' },
    PR: { nome: 'Paraná', capital: 'Curitiba' },
    RS: { nome: 'Rio Grande do Sul', capital: 'Porto Alegre' }
  };

  document.querySelectorAll('.estado-card').forEach(card => {
    card.addEventListener('click', () => {
      const sigla = card.dataset.sigla;
      const nome = card.dataset.estado;

      const estado = ESTADOS_DETALHES[sigla];
      if (!estado) return;

      estadoModalImage.src = `./assets/states/${sigla.toLowerCase()}.svg`;
      estadoModalName.textContent = nome;
      estadoModalInfo.textContent = `Capital: ${estado.capital}`;

      estadoModal.classList.remove('hidden');
    });
  });

  function closeModal() {
    estadoModal.classList.add('hidden');
  }

  estadoModalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

// ================================
// IBGE Integration (Estados Modal)
// ================================

document.querySelectorAll('.estado-card').forEach(card => {
  card.addEventListener('click', async () => {
    const sigla = card.dataset.sigla;

    try {
      const response = await fetch(`http://localhost:8080/api/ibge/${sigla}`);
      const data = await response.json();

      // Atualiza modal
      estadoModalImage.src = `./assets/states/${sigla.toLowerCase()}.svg`;
      estadoModalName.textContent = data.nome;
      estadoModalInfo.textContent = `Região: ${data.regiao}`;

      estadoModal.classList.remove('hidden');

    } catch (error) {
      showToast('Erro ao buscar dados do IBGE', 'error');
    }
  });
});

