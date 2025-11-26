// detail.js - Logic untuk halaman detail event
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    alert('Event tidak ditemukan!');
    window.location.href = 'event-list.html';
    return;
  }
  
  loadEventDetail(eventId);
  setupButtons(eventId);
});

function loadEventDetail(eventId) {
  const event = EventStorage.getEventById(parseInt(eventId));
  
  if (!event) {
    alert('Event tidak ditemukan!');
    window.location.href = 'event-list.html';
    return;
  }
  
  // Update page elements
  document.getElementById('eventImage').src = event.image;
  document.getElementById('eventImage').alt = event.title;
  document.getElementById('eventTitle').textContent = event.title;
  document.getElementById('eventDate').textContent = formatDate(event.date);
  document.getElementById('eventLocation').textContent = event.location;
  document.getElementById('eventCategory').innerHTML = `<span class="badge bg-primary">${event.category}</span>`;
  document.getElementById('eventOrganizer').textContent = event.organizer;
  document.getElementById('eventDescription').textContent = event.description;
  document.getElementById('eventPrice').textContent = formatPrice(event.price);
  
  // Update page title
  document.title = `${event.title} - EventHub`;
}

function setupButtons(eventId) {
  const registerBtn = document.getElementById('registerBtn');
  const favoriteBtn = document.getElementById('favoriteBtn');
  
  const eventIdInt = parseInt(eventId);
  
  // Check if already registered
  if (EventStorage.isRegistered(eventIdInt)) {
    registerBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Sudah Terdaftar';
    registerBtn.disabled = true;
    registerBtn.classList.remove('btn-primary');
    registerBtn.classList.add('btn-success');
  }
  
  // Check if already favorited
  updateFavoriteButton(eventIdInt);
  
  // Register button handler
  registerBtn.addEventListener('click', function() {
    if (!EventStorage.isRegistered(eventIdInt)) {
      const event = EventStorage.getEventById(eventIdInt);
      if (confirm(`Daftar untuk event "${event.title}"?`)) {
        EventStorage.registerForEvent(eventIdInt);
        alert('Berhasil mendaftar! Lihat dashboard untuk detail lebih lanjut.');
        this.innerHTML = '<i class="fas fa-check-circle me-2"></i>Sudah Terdaftar';
        this.disabled = true;
        this.classList.remove('btn-primary');
        this.classList.add('btn-success');
      }
    }
  });
  
  // Favorite button handler
  favoriteBtn.addEventListener('click', function() {
    if (EventStorage.isFavorite(eventIdInt)) {
      EventStorage.removeFromFavorites(eventIdInt);
      alert('Dihapus dari favorit');
    } else {
      EventStorage.addToFavorites(eventIdInt);
      alert('Ditambahkan ke favorit');
    }
    updateFavoriteButton(eventIdInt);
  });
}

function updateFavoriteButton(eventId) {
  const favoriteBtn = document.getElementById('favoriteBtn');
  if (EventStorage.isFavorite(eventId)) {
    favoriteBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Hapus dari Favorit';
    favoriteBtn.classList.remove('btn-outline-danger');
    favoriteBtn.classList.add('btn-danger');
  } else {
    favoriteBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Tambah ke Favorit';
    favoriteBtn.classList.remove('btn-danger');
    favoriteBtn.classList.add('btn-outline-danger');
  }
}

function formatDate(dateString) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatPrice(price) {
  if (price === 0) return 'Gratis';
  return 'Rp ' + price.toLocaleString('id-ID');
}