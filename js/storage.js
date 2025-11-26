// storage.js - Mengelola data event menggunakan memori
const EventStorage = {
  // Simulasi database dengan array
  events: [
    {
      id: 1,
      title: "Workshop Web Development",
      description: "Belajar membuat website modern dengan HTML, CSS, dan JavaScript dari dasar hingga mahir.",
      date: "2025-12-15",
      location: "Jakarta Convention Center",
      price: 150000,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      organizer: "Tech Academy",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Seminar Digital Marketing",
      description: "Strategi pemasaran digital terkini untuk meningkatkan bisnis Anda di era digital.",
      date: "2025-12-20",
      location: "Surabaya Business Center",
      price: 200000,
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      organizer: "Marketing Pro",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Music Festival 2025",
      description: "Festival musik terbesar tahun ini dengan lineup artis internasional dan lokal terbaik.",
      date: "2026-01-10",
      location: "Gelora Bung Karno",
      price: 500000,
      category: "Festival",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      organizer: "Music Events ID",
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "Startup Meetup",
      description: "Networking session untuk founder, investor, dan entrepreneur di ekosistem startup.",
      date: "2025-12-18",
      location: "Bandung Creative Hub",
      price: 0,
      category: "Meetup",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      organizer: "Startup Community",
      createdAt: new Date().toISOString()
    }
  ],
  
  favorites: [],
  registrations: [],
  
  // Get all events
  getAllEvents() {
    return this.events;
  },
  
  // Get event by ID
  getEventById(id) {
    return this.events.find(event => event.id === parseInt(id));
  },
  
  // Add new event
  addEvent(eventData) {
    const newEvent = {
      id: this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    this.events.push(newEvent);
    return newEvent;
  },
  
  // Update event
  updateEvent(id, eventData) {
    const index = this.events.findIndex(event => event.id === parseInt(id));
    if (index !== -1) {
      this.events[index] = {
        ...this.events[index],
        ...eventData
      };
      return this.events[index];
    }
    return null;
  },
  
  // Delete event
  deleteEvent(id) {
    const index = this.events.findIndex(event => event.id === parseInt(id));
    if (index !== -1) {
      this.events.splice(index, 1);
      // Remove from favorites and registrations
      this.favorites = this.favorites.filter(fav => fav !== parseInt(id));
      this.registrations = this.registrations.filter(reg => reg !== parseInt(id));
      return true;
    }
    return false;
  },
  
  // Favorite functions
  addToFavorites(eventId) {
    const id = parseInt(eventId);
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
      return true;
    }
    return false;
  },
  
  removeFromFavorites(eventId) {
    const id = parseInt(eventId);
    const index = this.favorites.indexOf(id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      return true;
    }
    return false;
  },
  
  isFavorite(eventId) {
    return this.favorites.includes(parseInt(eventId));
  },
  
  getFavoriteEvents() {
    return this.events.filter(event => this.favorites.includes(event.id));
  },
  
  // Registration functions
  registerForEvent(eventId) {
    const id = parseInt(eventId);
    if (!this.registrations.includes(id)) {
      this.registrations.push(id);
      return true;
    }
    return false;
  },
  
  isRegistered(eventId) {
    return this.registrations.includes(parseInt(eventId));
  },
  
  // Filter and search functions
  filterEvents(filters) {
    let filtered = [...this.events];
    
    // Search by title
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    // Sort
    if (filters.sort) {
      switch (filters.sort) {
        case 'date-asc':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'date-desc':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
    }
    
    return filtered;
  }
};

// Make available globally
window.EventStorage = EventStorage;