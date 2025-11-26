// add-event.js - Logic untuk menambah event baru
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addEventForm');
  
  // Set minimum date to today
  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      createEvent();
    }
  });
  
  // Reset form handler
  form.addEventListener('reset', function() {
    clearErrors();
  });
});

function validateForm() {
  let isValid = true;
  clearErrors();
  
  // Validate title
  const title = document.getElementById('title').value.trim();
  if (title.length < 5) {
    showError('titleError', 'Judul harus minimal 5 karakter');
    isValid = false;
  }
  
  // Validate description
  const description = document.getElementById('description').value.trim();
  if (description.length < 20) {
    showError('descriptionError', 'Deskripsi harus minimal 20 karakter');
    isValid = false;
  }
  
  // Validate date
  const date = document.getElementById('date').value;
  if (!date) {
    showError('dateError', 'Tanggal harus diisi');
    isValid = false;
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showError('dateError', 'Tanggal tidak boleh di masa lalu');
      isValid = false;
    }
  }
  
  // Validate location
  const location = document.getElementById('location').value.trim();
  if (location.length < 3) {
    showError('locationError', 'Lokasi harus minimal 3 karakter');
    isValid = false;
  }
  
  // Validate price
  const price = document.getElementById('price').value;
  if (price === '' || price < 0) {
    showError('priceError', 'Harga harus diisi dan tidak boleh negatif');
    isValid = false;
  }
  
  // Validate category
  const category = document.getElementById('category').value;
  if (!category) {
    showError('categoryError', 'Kategori harus dipilih');
    isValid = false;
  }
  
  // Validate organizer
  const organizer = document.getElementById('organizer').value.trim();
  if (organizer.length < 3) {
    showError('organizerError', 'Nama penyelenggara harus minimal 3 karakter');
    isValid = false;
  }
  
  return isValid;
}

function createEvent() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value.trim();
  const price = parseInt(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const image = document.getElementById('image').value.trim() || getRandomPlaceholder();
  const organizer = document.getElementById('organizer').value.trim();
  
  const eventData = {
    title,
    description,
    date,
    location,
    price,
    category,
    image,
    organizer
  };
  
  const newEvent = EventStorage.addEvent(eventData);
  
  if (newEvent) {
    alert('Event berhasil dibuat!');
    // Redirect to event detail page
    window.location.href = `detail.html?id=${newEvent.id}`;
  } else {
    alert('Gagal membuat event. Silakan coba lagi.');
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('small.text-danger');
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

function getRandomPlaceholder() {
  const placeholders = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
  ];
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}