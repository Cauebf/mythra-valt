const featuredProducts = [
  {
    id: "1",
    name: "Relógio de Bolso Vintage",
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1677445166019-4fa91a090e49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVsb2dpbyUyMHZpbnRhZ2V8ZW58MHx8MHx8fDA%3D",
    category: "Relógios",
  },
  {
    id: "2",
    name: "Gramofone Restaurado 1920",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1679658430346-ebb9d485abe4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyYW1vZm9uZXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Música",
  },
  {
    id: "3",
    name: "Máquina de Escrever Remington",
    price: 950,
    image:
      "https://images.unsplash.com/photo-1542765347-c1dc0e9f9883?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fG1hcXVpbmElMjBkZSUyMGVzY3JldmVyfGVufDB8MHwwfHx8MA%3D%3D",
    category: "Escritório",
  },
  {
    id: "4",
    name: "Cartucho The Legend of Zelda",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1705623337603-58e849d027f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmludGVuZG8lMjA2NHxlbnwwfDB8MHx8fDA%3D",
    category: "Videogames",
  },
];

const auctions = [
  {
    id: "1",
    name: "Pintura a Óleo Século XIX",
    currentBid: 5600,
    endTime: "2025-05-31T23:59:59",
    image:
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGludHVyYSUyMGElMjBvbGVvfGVufDB8fDB8fHww",
    bids: 12,
    category: "Arte",
    status: "active",
  },
  {
    id: "2",
    name: "Cômoda Vitoriana",
    currentBid: 4200,
    endTime: "2025-05-28T18:30:00",
    image:
      "https://images.unsplash.com/photo-1739999064266-ea6ea21beaab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbW9kYSUyMHZpdG9yaWFuYXxlbnwwfDB8MHx8fDA%3D",
    bids: 8,
    category: "Móveis",
    status: "active",
  },
  {
    id: "3",
    name: "Super Nintendo",
    currentBid: 3800,
    endTime: "2025-05-29T20:15:00",
    image:
      "https://images.unsplash.com/photo-1630051822408-b80dde2f5681?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmludGVuZG98ZW58MHwwfDB8fHww",
    bids: 15,
    category: "Videogames",
    status: "active",
  },
  {
    id: "4",
    name: "Relógio de Parede Antigo",
    currentBid: 1200,
    endTime: "2025-05-25T12:00:00",
    image:
      "https://images.unsplash.com/photo-1724230758611-7cb93468d7d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVsb2dpbyUyMGRlJTIwcGFyZWRlJTIwYW50aWdvfGVufDB8MHwwfHx8MA%3D%3D",
    bids: 5,
    category: "Relógios",
    status: "active",
  },
  {
    id: "5",
    name: "Moedas de Ouro Século XVIII",
    currentBid: 8500,
    endTime: "2025-05-30T15:45:00",
    image:
      "https://images.unsplash.com/photo-1643823062948-32438ef15142?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bW9lZGFzJTIwZGUlMjBvdXJvJTIwYW50aWdhfGVufDB8MHwwfHx8MA%3D%3D",
    bids: 20,
    category: "Numismática",
    status: "active",
  },
  {
    id: "6",
    name: "Livro Raro Primeira Edição",
    currentBid: 3200,
    endTime: "2025-05-27T10:30:00",
    image:
      "https://images.unsplash.com/photo-1741383663660-3bb043937e44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGxpdnJvJTIwcmFyb3xlbnwwfDB8MHx8fDA%3D",
    bids: 7,
    category: "Livros",
    status: "active",
  },
];

const activeAuctions = auctions.slice(0, 3);

export { featuredProducts, auctions, activeAuctions };
