// event-list.js - Logic untuk halaman daftar event dengan filter dan search
let currentFilters = {
  search: '',
  category: '',
  sort: 'date-asc'
};

document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  loadEvents();
});

function initializeFilters() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce(function(e) {
    currentFilters.search = e.target.value;
    loadEvents();
  }, 300));
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.addEventListener('change', function(e) {
    currentFilters.category = e.target.value;
    loadEvents();
  });
  
  // Sort filter
  const sortFilter = document.getElementById('sortFilter');
  sortFilter.addEventListener('change', function(e) {
    currentFilters.sort = e.target.value;
    loadEvents();
  });
  
  // Reset button
  const resetBtn = document.getElementById('resetFilters');
  resetBtn.addEventListener('click', function() {
    searchInput.value = '';
    categoryFilter.value = '';
    sortFilter.value = 'date-asc';
    currentFilters = {
      search: '',
      category: '',
      sort: 'date-asc'
    };
    loadEvents();
  });
}

function loadEvents() {
  const container = document.getElementById('eventsContainer');
  const emptyMessage = document.getElementById('emptyMessage');
  
  const events = EventStorage.filterEvents(currentFilters);
  
  if (events.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  container.innerHTML = events.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  const isFavorite = EventStorage.isFavorite(event.id);
  const isRegistered = EventStorage.isRegistered(event.id);
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card shadow-sm h-100">
        <div class="position-relative">
          <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
          <button 
            onclick="toggleFavorite(${event.id})" 
            class="btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite ? 'btn-danger' : 'btn-light'}"
            style="border-radius: 50%; width: 40px; height: 40px;">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="card-body event-card-body">
          <span class="badge bg-primary mb-2">${event.category}</span>
          ${isRegistered ? '<span class="badge bg-success mb-2 ms-1">Terdaftar</span>' : ''}
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text text-muted small">${truncateText(event.description, 100)}</p>
          <div class="mb-2">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i>${formattedDate}
            </small>
          </div>
          <div class="mb-2">
            <small class="text-muted">
              <i class="fas fa-map-marker-alt me-1"></i>${event.location}
            </small>
          </div>
          <div class="mt-3">
            <strong class="text-primary">${formattedPrice}</strong>
          </div>
        </div>
        <div class="card-footer bg-white border-0 event-card-footer">
          <a href="detail.html?id=${event.id}" class="btn btn-outline-primary btn-sm flex-fill">
            <i class="fas fa-info-circle me-1"></i>Detail
          </a>
          <button onclick="registerEvent(${event.id})" class="btn btn-primary btn-sm flex-fill" ${isRegistered ? 'disabled' : ''}>
            <i class="fas fa-check-circle me-1"></i>${isRegistered ? 'Terdaftar' : 'Daftar'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function toggleFavorite(eventId) {
  if (EventStorage.isFavorite(eventId)) {
    EventStorage.removeFromFavorites(eventId);
  } else {
    EventStorage.addToFavorites(eventId);
  }
  loadEvents();
}

function registerEvent(eventId) {
  if (EventStorage.isRegistered(eventId)) {
    return;
  }
  
  const event = EventStorage.getEventById(eventId);
  if (confirm(`Daftar untuk event "${event.title}"?`)) {
    EventStorage.registerForEvent(eventId);
    alert('Berhasil mendaftar!');
    loadEvents();
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatPrice(price) {
  if (price === 0) return 'Gratis';
  return 'Rp ' + price.toLocaleString('id-ID');
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Debounce function untuk search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}