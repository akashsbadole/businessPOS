import { Product, Transaction, Customer } from "../types/pos";

export const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Tata Salt",
    price: 20,
    category: "grocery",
    stock: 50,
    hsn: "2501",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=1"
  },
  {
    id: "p2",
    name: "Aashirvaad Atta 5kg",
    price: 250,
    category: "grocery",
    stock: 25,
    hsn: "1101",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=2"
  },
  {
    id: "p3",
    name: "Amul Butter 100g",
    price: 50,
    category: "dairy",
    stock: 30,
    hsn: "0405",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=3"
  },
  {
    id: "p4",
    name: "Parle-G Biscuits",
    price: 10,
    category: "snacks",
    stock: 100,
    hsn: "1905",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=4"
  },
  {
    id: "p5",
    name: "Maggi Noodles",
    price: 14,
    category: "snacks",
    stock: 80,
    hsn: "1902",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=5"
  },
  {
    id: "p6",
    name: "Colgate Toothpaste",
    price: 55,
    category: "personal care",
    stock: 40,
    hsn: "3306",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=6"
  },
  {
    id: "p7",
    name: "Surf Excel 1kg",
    price: 140,
    category: "household",
    stock: 20,
    hsn: "3402",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=7"
  },
  {
    id: "p8",
    name: "Dove Soap",
    price: 45,
    category: "personal care",
    stock: 35,
    hsn: "3401",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=8"
  },
  {
    id: "p9",
    name: "Britannia Good Day",
    price: 30,
    category: "snacks",
    stock: 60,
    hsn: "1905",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=9"
  },
  {
    id: "p10",
    name: "Amul Milk 500ml",
    price: 25,
    category: "dairy",
    stock: 15,
    hsn: "0401",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=10"
  },
  {
    id: "p11",
    name: "Coca Cola 1L",
    price: 65,
    category: "beverages",
    stock: 45,
    hsn: "2202",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=11"
  },
  {
    id: "p12",
    name: "Lays Chips",
    price: 20,
    category: "snacks",
    stock: 70,
    hsn: "2005",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=12"
  },
  {
    id: "p13",
    name: "Dettol Hand Wash",
    price: 99,
    category: "personal care",
    stock: 25,
    hsn: "3401",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=13"
  },
  {
    id: "p14",
    name: "Sunfeast Dark Fantasy",
    price: 30,
    category: "snacks",
    stock: 40,
    hsn: "1905",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=14"
  },
  {
    id: "p15",
    name: "Tata Tea Premium 250g",
    price: 140,
    category: "grocery",
    stock: 30,
    hsn: "0902",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=15"
  },
  {
    id: "p16",
    name: "Clinic Plus Shampoo",
    price: 120,
    category: "personal care",
    stock: 5,
    hsn: "3305",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=16"
  },
  {
    id: "p17",
    name: "Kissan Ketchup",
    price: 110,
    category: "grocery",
    stock: 3,
    hsn: "2103",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=17"
  },
  {
    id: "p18",
    name: "Haldiram's Namkeen",
    price: 55,
    category: "snacks",
    stock: 0,
    hsn: "2106",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=18"
  },
  {
    id: "p19",
    name: "Vim Dishwash Bar",
    price: 10,
    category: "household",
    stock: 90,
    hsn: "3402",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=19"
  },
  {
    id: "p20",
    name: "Dairy Milk Chocolate",
    price: 40,
    category: "snacks",
    stock: 55,
    hsn: "1806",
    image: "https://img.heroui.chat/image/food?w=200&h=200&u=20"
  }
];

export const sampleTransactions: Transaction[] = [
  {
    id: "t1",
    invoiceNumber: "INV-001",
    date: "2024-05-01",
    customer: "Raj Kumar",
    amount: 520.50,
    paymentMethod: "cash",
    status: "completed"
  },
  {
    id: "t2",
    invoiceNumber: "INV-002",
    date: "2024-05-01",
    customer: "Priya Sharma",
    amount: 1250.75,
    paymentMethod: "upi",
    status: "completed"
  },
  {
    id: "t3",
    invoiceNumber: "INV-003",
    date: "2024-05-02",
    customer: null,
    amount: 75.00,
    paymentMethod: "cash",
    status: "completed"
  },
  {
    id: "t4",
    invoiceNumber: "INV-004",
    date: "2024-05-02",
    customer: "Amit Patel",
    amount: 2100.25,
    paymentMethod: "card",
    status: "completed"
  },
  {
    id: "t5",
    invoiceNumber: "INV-005",
    date: "2024-05-03",
    customer: "Neha Singh",
    amount: 450.00,
    paymentMethod: "upi",
    status: "pending"
  },
  {
    id: "t6",
    invoiceNumber: "INV-006",
    date: "2024-05-03",
    customer: null,
    amount: 120.50,
    paymentMethod: "cash",
    status: "completed"
  },
  {
    id: "t7",
    invoiceNumber: "INV-007",
    date: "2024-05-04",
    customer: "Vikram Joshi",
    amount: 1800.00,
    paymentMethod: "card",
    status: "completed"
  },
  {
    id: "t8",
    invoiceNumber: "INV-008",
    date: "2024-05-04",
    customer: "Meera Reddy",
    amount: 350.25,
    paymentMethod: "wallet",
    status: "cancelled"
  }
];

export const sampleCustomers: Customer[] = [
  {
    id: "c1",
    name: "Raj Kumar",
    phone: "9876543210",
    email: "raj@example.com",
    totalOrders: 12,
    totalSpent: 5600.50,
    status: "active"
  },
  {
    id: "c2",
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya@example.com",
    totalOrders: 8,
    totalSpent: 3200.75,
    status: "active"
  },
  {
    id: "c3",
    name: "Amit Patel",
    phone: "9876543212",
    email: "amit@example.com",
    totalOrders: 15,
    totalSpent: 7800.25,
    status: "active"
  },
  {
    id: "c4",
    name: "Neha Singh",
    phone: "9876543213",
    email: "neha@example.com",
    totalOrders: 5,
    totalSpent: 2100.00,
    status: "active"
  },
  {
    id: "c5",
    name: "Vikram Joshi",
    phone: "9876543214",
    email: "vikram@example.com",
    totalOrders: 10,
    totalSpent: 4500.50,
    status: "active"
  },
  {
    id: "c6",
    name: "Meera Reddy",
    phone: "9876543215",
    email: "meera@example.com",
    totalOrders: 3,
    totalSpent: 1200.25,
    status: "inactive"
  },
  {
    id: "c7",
    name: "Suresh Kumar",
    phone: "9876543216",
    email: "suresh@example.com",
    totalOrders: 7,
    totalSpent: 3500.00,
    status: "active"
  },
  {
    id: "c8",
    name: "Anjali Gupta",
    phone: "9876543217",
    email: "anjali@example.com",
    totalOrders: 4,
    totalSpent: 1800.75,
    status: "inactive"
  },
  {
    id: "c9",
    name: "Rahul Verma",
    phone: "9876543218",
    email: "rahul@example.com",
    totalOrders: 9,
    totalSpent: 4200.50,
    status: "active"
  },
  {
    id: "c10",
    name: "Pooja Desai",
    phone: "9876543219",
    email: "pooja@example.com",
    totalOrders: 6,
    totalSpent: 2800.25,
    status: "active"
  }
];
