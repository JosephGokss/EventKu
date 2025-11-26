// home.js - Logic untuk halaman beranda
document.addEventListener('DOMContentLoaded', function() {
  loadLatestEvents();
});

function loadLatestEvents() {
  const container = document.getElementById('latestEventsContainer');
  const events = EventStorage.getAllEvents();
  
  // Ambil 3 event terbaru berdasarkan tanggal terdekat
  const sortedEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  
  if (sortedEvents.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-info-circle me-2"></i>Belum ada event tersedia
        </div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sortedEvents.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card shadow-sm h-100">
        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body event-card-body">
          <span class="badge bg-primary mb-2">${event.category}</span>
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
          <a href="pages/detail.html?id=${event.id}" class="btn btn-outline-primary btn-sm flex-fill">
            <i class="fas fa-info-circle me-1"></i>Detail
          </a>
          <button onclick="quickRegister(${event.id})" class="btn btn-primary btn-sm flex-fill">
            <i class="fas fa-check-circle me-1"></i>Daftar
          </button>
        </div>
      </div>
    </div>
  `;
}

function quickRegister(eventId) {
  const event = EventStorage.getEventById(eventId);
  if (!event) {
    alert('Event tidak ditemukan!');
    return;
  }
  
  if (EventStorage.isRegistered(eventId)) {
    alert('Anda sudah terdaftar untuk event ini!');
    return;
  }
  
  if (confirm(`Daftar untuk event "${event.title}"?`)) {
    EventStorage.registerForEvent(eventId);
    alert('Berhasil mendaftar! Lihat dashboard untuk detail lebih lanjut.');
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