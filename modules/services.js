// ═══ SERVICES MODULE ═══
// All DigiCafe services data and rendering

const SERVICES = [
  {icon:'💰', name:'Income Tax (ITR)', price:'999', category:'tax'},
  {icon:'📊', name:'GST Registration', price:'1999', category:'gst'},
  {icon:'🏢', name:'Company Registration', price:'4999', category:'company'},
  {icon:'📋', name:'TDS Compliance', price:'1499', category:'tax'},
  {icon:'™️', name:'Trademark Registration', price:'2999', category:'ip'},
  {icon:'🔐', name:'Digital Signature (DSC)', price:'1299', category:'digital'},
  {icon:'🚀', name:'MSME/Udyam Registration', price:'1499', category:'msme'},
  {icon:'👤', name:'PAN/TAN/Aadhaar', price:'499', category:'pan'},
  {icon:'📈', name:'Accounting & Bookkeeping', price:'2999', category:'accounting'},
  {icon:'🎯', name:'GST Compliance Filing', price:'1999', category:'gst'},
  {icon:'📑', name:'Business Registration', price:'3999', category:'company'},
  {icon:'💼', name:'Business Consultation', price:'2999', category:'consulting'},
  {icon:'🧾', name:'GST Returns & Reconciliation', price:null, category:'gst'},
  {icon:'📚', name:'Bookkeeping & Monthly Accounts', price:null, category:'accounting'},
  {icon:'🏛️', name:'MCA / ROC Annual Compliance', price:null, category:'company'},
  {icon:'🧮', name:'TDS / TCS Returns & Support', price:null, category:'tax'},
  {icon:'👥', name:'Payroll & HR Support', price:null, category:'payroll'},
  {icon:'⚖️', name:'Labour Compliance Assistance', price:null, category:'compliance'},
  {icon:'🗂️', name:'LLP Compliance & Filings', price:null, category:'company'},
  {icon:'🧾', name:'Accounting Reconciliation Support', price:null, category:'accounting'},
];

/* RENDER SERVICES TO ELEMENT */
function renderServices(containerSelector, filter = null) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container not found: ${containerSelector}`);
    return;
  }

  let servicesToShow = SERVICES;
  if (filter) {
    servicesToShow = SERVICES.filter(s => s.category === filter);
  }

  container.innerHTML = servicesToShow.map(service => `
    <div class="card service-card" data-service="${service.name}">
      <div class="service-icon" style="font-size: 2.5rem; margin-bottom: 1rem;">
        ${service.icon}
      </div>
      <h3 class="service-name" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">
        ${service.name}
      </h3>
      <div class="service-price" style="color: var(--gold); font-weight: 600; margin-bottom: 1rem;">
        ${service.price ? `₹${service.price}+` : 'Contact for a quote'}
      </div>
      <button class="btn btn-primary btn-small w-100" onclick="selectService('${service.name}')">
        Request Service
      </button>
    </div>
  `).join('');
}

/* GET SERVICE BY NAME */
function getServiceByName(name) {
  return SERVICES.find(s => s.name === name);
}

/* GET ALL SERVICES BY CATEGORY */
function getServicesByCategory(category) {
  return SERVICES.filter(s => s.category === category);
}

/* GET UNIQUE CATEGORIES */
function getServiceCategories() {
  return [...new Set(SERVICES.map(s => s.category))];
}

/* SELECT SERVICE FOR REQUEST */
function selectService(serviceName) {
  if (!isLoggedIn()) {
    showToast('Please login to request services', 'info');
    setTimeout(() => showPage('auth'), 1000);
    return;
  }

  // Set selected service
  const service = getServiceByName(serviceName);
  if (service) {
    const select = document.getElementById('service-select');
    if (select) {
      select.value = serviceName;
    }
    showPage('request');
    showToast(`Selected: ${serviceName}`);
  }
}

console.log('✅ Services module loaded -', SERVICES.length, 'services');
