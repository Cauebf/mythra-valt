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

const activeAuctions = [
  {
    id: "1",
    name: "Pintura a Óleo Século XIX",
    currentBid: 5600,
    endTime: "2023-12-31T23:59:59",
    image: "/placeholder.svg?height=300&width=300",
    bids: 12,
  },
  {
    id: "2",
    name: "Cômoda Vitoriana",
    currentBid: 4200,
    endTime: "2023-12-28T18:30:00",
    image: "/placeholder.svg?height=300&width=300",
    bids: 8,
  },
  {
    id: "3",
    name: "Conjunto de Porcelana Chinesa",
    currentBid: 3800,
    endTime: "2023-12-29T20:15:00",
    image: "/placeholder.svg?height=300&width=300",
    bids: 15,
  },
];

export { featuredProducts, activeAuctions };
