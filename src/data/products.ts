import productBarSet from "@/assets/product-bar-set-3glass-1.jpg";
import productTrolley from "@/assets/product-trolley-1.jpg";
import productMensWallet from "@/assets/product-mens-wallet-1.jpg";
import productLadiesWallet from "@/assets/product-ladies-wallet-1.jpg";
import productLaptopBag from "@/assets/product-laptop-bag-3.jpg";
import productPassport from "@/assets/product-passport-holder-1.jpg";
import productBriefcase1 from "@/assets/product-briefcase-1.jpg";
import productBriefcase2 from "@/assets/product-briefcase-2.jpg";
import productMessenger1 from "@/assets/product-messenger-1.jpg";
import productMessenger2 from "@/assets/product-messenger-2.jpg";
import productTote1 from "@/assets/product-tote-1.jpg";
import productTote2 from "@/assets/product-tote-2.jpg";
import productLaptop1 from "@/assets/product-laptop-1.jpg";
import productLaptop2 from "@/assets/product-laptop-2.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  features?: string[];
  specifications?: { label: string; value: string }[];
}

// Sample products - you can expand this based on the catalog
export const products: Product[] = [
  {
    id: "three-glasses-bar-set",
    name: "Three Glasses Bar Set",
    description: "Premium bar set with three glasses, perfect for entertaining guests. Crafted with high-quality materials and elegant design.",
    price: 4999,
    images: [
      productBarSet,
      productBarSet,
    ],
    category: "bar-hotel",
    subcategory: "bar-sets",
    features: [
      "Includes 3 premium glasses",
      "Elegant leather case",
      "Perfect for gifting",
      "Durable construction"
    ],
    specifications: [
      { label: "Material", value: "Leather & Glass" },
      { label: "Color", value: "Brown" },
      { label: "Dimensions", value: "30cm x 20cm x 10cm" },
    ],
  },
  {
    id: "two-glasses-bar-set",
    name: "Two Glasses Bar Set",
    description: "Compact bar set with two glasses, ideal for personal use or small gatherings.",
    price: 3999,
    images: [
      productBarSet,
    ],
    category: "bar-hotel",
    subcategory: "bar-sets",
    features: [
      "Includes 2 premium glasses",
      "Compact design",
      "Travel-friendly",
    ],
    specifications: [
      { label: "Material", value: "Leather & Glass" },
      { label: "Color", value: "Black" },
    ],
  },
  {
    id: "ndm-leather-trolley",
    name: "NDM Leather Trolley Bag",
    description: "Premium leather trolley bag with multiple compartments, perfect for business travel.",
    price: 12999,
    images: [
      productTrolley,
      productTrolley,
    ],
    category: "leather-bags",
    subcategory: "trolley-bags",
    features: [
      "100% Genuine leather",
      "Multiple compartments",
      "Smooth rolling wheels",
      "TSA-approved locks"
    ],
    specifications: [
      { label: "Material", value: "Pure Leather" },
      { label: "Capacity", value: "45 Liters" },
      { label: "Dimensions", value: "55cm x 35cm x 25cm" },
    ],
  },
  {
    id: "executive-briefcase",
    name: "Executive Leather Briefcase",
    description: "Sophisticated briefcase designed for professionals who demand excellence.",
    price: 24999,
    images: [
      productBriefcase1,
      productBriefcase2,
    ],
    category: "leather-bags",
    subcategory: "briefcases",
    features: [
      "Premium leather construction",
      "Multiple pockets",
      "Laptop compartment",
      "Professional design"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Laptop Size", value: "Up to 15.6 inches" },
      { label: "Color Options", value: "Brown, Black" },
    ],
  },
  {
    id: "mens-leather-wallet",
    name: "Premium Men's Leather Wallet",
    description: "Classic bifold wallet with multiple card slots and bill compartment.",
    price: 1999,
    images: [
      productMensWallet,
      productMensWallet,
    ],
    category: "mens-wallets",
    subcategory: "leather-wallets",
    features: [
      "8 card slots",
      "2 bill compartments",
      "RFID protection",
      "Slim profile"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Color", value: "Brown" },
      { label: "Dimensions", value: "11cm x 9cm" },
    ],
  },
  {
    id: "ladies-clutch",
    name: "Ladies Leather Clutch",
    description: "Elegant clutch wallet with multiple compartments for cards and cash.",
    price: 2499,
    images: [
      productLadiesWallet,
      productLadiesWallet,
    ],
    category: "ladies-wallets",
    subcategory: "clutches",
    features: [
      "10 card slots",
      "Zippered coin pocket",
      "Phone compartment",
      "Elegant design"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Color Options", value: "Black, Tan, Red" },
    ],
  },
  {
    id: "leather-laptop-bag",
    name: "Premium Leather Laptop Bag",
    description: "Professional laptop bag with padded compartment, perfect for daily commute.",
    price: 16999,
    images: [
      productLaptopBag,
      productLaptop1,
      productLaptop2,
    ],
    category: "leather-bags",
    subcategory: "laptop-bags",
    features: [
      "Fits laptops up to 15.6 inches",
      "Padded laptop compartment",
      "Multiple storage pockets",
      "Adjustable shoulder strap"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Laptop Size", value: "Up to 15.6 inches" },
      { label: "Dimensions", value: "40cm x 30cm x 10cm" },
    ],
  },
  {
    id: "classic-messenger-bag",
    name: "Classic Messenger Bag",
    description: "Versatile messenger bag with vintage styling and modern functionality.",
    price: 18999,
    images: [
      productMessenger1,
      productMessenger2,
    ],
    category: "leather-bags",
    subcategory: "sling-bags",
    features: [
      "Adjustable crossbody strap",
      "Multiple compartments",
      "Vintage styling",
      "Water-resistant"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Dimensions", value: "35cm x 28cm x 8cm" },
    ],
  },
  {
    id: "business-tote-bag",
    name: "Premium Business Tote",
    description: "Elegant tote bag perfect for professionals and daily use.",
    price: 21999,
    images: [
      productTote1,
      productTote2,
    ],
    category: "leather-bags",
    subcategory: "briefcases",
    features: [
      "Spacious main compartment",
      "Interior pockets",
      "Sturdy leather handles",
      "Professional design"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Dimensions", value: "38cm x 32cm x 12cm" },
    ],
  },
  {
    id: "passport-holder-travel-wallet",
    name: "Leather Passport Holder & Travel Wallet",
    description: "Premium passport holder with multiple card slots and document compartments.",
    price: 1499,
    images: [
      productPassport,
      productPassport,
    ],
    category: "ticket-folders",
    subcategory: "passport-holders",
    features: [
      "Holds passport securely",
      "Card slots",
      "Boarding pass pocket",
      "RFID protection"
    ],
    specifications: [
      { label: "Material", value: "Genuine Leather" },
      { label: "Color", value: "Brown" },
    ],
  },
];
