// Mock data for products
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    price: 32990000,
    image: 'https://via.placeholder.com/200x200',
    discount: 15,
    isNew: true,
    category: 'featured',
    specifications: {
      screen: '6.7 inches OLED',
      processor: 'A17 Pro',
      ram: '8GB',
      storage: '256GB',
      camera: '48MP + 12MP + 12MP',
      battery: '4422 mAh'
    },
    colors: [
      { name: 'Natural Titanium', code: '#9E9E9E' },
      { name: 'Blue Titanium', code: '#4B4F5C' },
      { name: 'White Titanium', code: '#F5F5F5' },
      { name: 'Black Titanium', code: '#2B2B2B' }
    ],
    images: [
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500'
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 29990000,
    image: 'https://via.placeholder.com/200x200',
    discount: 12,
    isNew: true,
    category: 'featured',
    specifications: {
      screen: '6.8 inches Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '200MP + 12MP + 50MP + 10MP',
      battery: '5000 mAh'
    },
    colors: [
      { name: 'Titanium Gray', code: '#808080' },
      { name: 'Titanium Black', code: '#000000' },
      { name: 'Titanium Violet', code: '#8B00FF' },
      { name: 'Titanium Yellow', code: '#FFD700' }
    ],
    images: [
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500'
    ],
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-14T15:30:00Z'
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    image: 'https://via.placeholder.com/200x200',
    discount: 10,
    isNew: true,
    category: 'featured',
    specifications: {
      screen: '6.82 inches AMOLED',
      processor: 'Dimensity 9300',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP + 50MP + 50MP + 50MP',
      battery: '5000 mAh'
    },
    colors: [
      { name: 'Ocean Blue', code: '#0000FF' },
      { name: 'Desert Silver', code: '#C0C0C0' }
    ],
    images: [
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500'
    ],
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z'
  },
  {
    id: 4,
    name: 'Xiaomi 14 Ultra',
    price: 23990000,
    image: 'https://via.placeholder.com/200x200',
    discount: 8,
    isNew: true,
    category: 'new',
    specifications: {
      screen: '6.73 inches LTPO AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP + 50MP + 50MP + 50MP',
      battery: '5000 mAh'
    },
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Green', code: '#00FF00' }
    ],
    images: [
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500'
    ],
    createdAt: '2024-03-12T14:20:00Z',
    updatedAt: '2024-03-12T14:20:00Z'
  },
  {
    id: 5,
    name: 'OnePlus 12',
    price: 19990000,
    image: 'https://via.placeholder.com/200x200',
    discount: 5,
    isNew: true,
    category: 'new',
    specifications: {
      screen: '6.82 inches LTPO AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP + 48MP + 64MP',
      battery: '5400 mAh'
    },
    colors: [
      { name: 'Flowy Emerald', code: '#50C878' },
      { name: 'Silky Black', code: '#000000' }
    ],
    images: [
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500',
      'https://via.placeholder.com/500x500'
    ],
    createdAt: '2024-03-11T11:45:00Z',
    updatedAt: '2024-03-11T11:45:00Z'
  }
];

// Helper functions to filter products
const getFeaturedProducts = () => products.filter(product => product.category === 'featured');
const getNewProducts = () => products
  .filter(product => product.isNew)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const getProductById = (id) => products.find(product => product.id === parseInt(id));

export {
  products,
  getFeaturedProducts,
  getNewProducts,
  getProductById
}; 