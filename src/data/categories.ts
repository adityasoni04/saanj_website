import categoryBarHotel from "@/assets/category-bar-hotel.jpg";
import categoryLeatherBags from "@/assets/category-briefcases.jpg";
import categoryPuBags from "@/assets/category-pu-bags.jpg";
import categoryLeatherGifts from "@/assets/category-leather-gifts.jpg";
import categoryComboNonLeather from "@/assets/category-combo-non-leather.jpg";
import categoryOtherCombos from "@/assets/category-other-combos.jpg";
import categoryMensWallets from "@/assets/category-mens-wallets.jpg";
import categoryLadiesWallets from "@/assets/category-ladies-wallets.jpg";
import categoryTicketFolders from "@/assets/category-ticket-folders.jpg";
import categoryFileFolders from "@/assets/category-file-folders.jpg";
import categoryDeskAccessories from "@/assets/category-desk-accessories.jpg";
import categoryMiscellaneous from "@/assets/category-miscellaneous.jpg";
import categoryDivinity from "@/assets/category-divinity.jpg";
import categoryPromotionalKeychains from "@/assets/category-promotional-keychains.jpg";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: "bar-hotel",
    name: "Bar & Hotel Accessories",
    slug: "bar-hotel-accessories",
    image: categoryBarHotel,
    subcategories: [
      { id: "bar-sets", name: "Bar Sets", slug: "bar-sets" },
      { id: "wine-holders", name: "Wine Holders", slug: "wine-holders" },
      { id: "coasters", name: "Coasters & Trays", slug: "coasters" },
      { id: "hotel-items", name: "Hotel Items", slug: "hotel-items" },
    ],
  },
  {
    id: "leather-bags",
    name: "Leather Bags",
    slug: "leather-bags",
    image: categoryLeatherBags,
    subcategories: [
      { id: "trolley-bags", name: "Trolley Bags", slug: "trolley-bags" },
      { id: "laptop-bags", name: "Laptop Bags", slug: "laptop-bags" },
      { id: "sling-bags", name: "Sling Bags", slug: "sling-bags" },
      { id: "briefcases", name: "Briefcases", slug: "briefcases" },
    ],
  },
  {
    id: "pu-bags",
    name: "PU Bags",
    slug: "pu-bags",
    image: categoryPuBags,
    subcategories: [
      { id: "pu-laptop", name: "PU Laptop Bags", slug: "pu-laptop" },
      { id: "pu-backpacks", name: "PU Backpacks", slug: "pu-backpacks" },
      { id: "pu-messenger", name: "PU Messenger Bags", slug: "pu-messenger" },
    ],
  },
  {
    id: "pure-leather-gifts",
    name: "Pure Leather Gift Sets",
    slug: "pure-leather-gifts",
    image: categoryLeatherGifts,
    subcategories: [
      { id: "executive-sets", name: "Executive Gift Sets", slug: "executive-sets" },
      { id: "premium-sets", name: "Premium Gift Sets", slug: "premium-sets" },
      { id: "luxury-sets", name: "Luxury Gift Sets", slug: "luxury-sets" },
    ],
  },
  // {
  //   id: "combo-non-leather",
  //   name: "Combo Gift Set Non Leather",
  //   slug: "combo-non-leather",
  //   image: categoryComboNonLeather,
  //   subcategories: [
  //     { id: "corporate-combos", name: "Corporate Combos", slug: "corporate-combos" },
  //     { id: "gift-combos", name: "Gift Combos", slug: "gift-combos" },
  //   ],
  // },
  {
    id: "other-combos",
    name: "Other Combo Sets",
    slug: "other-combos",
    image: categoryOtherCombos,
    subcategories: [
      { id: "mixed-combos", name: "Mixed Combos", slug: "mixed-combos" },
      { id: "special-combos", name: "Special Combos", slug: "special-combos" },
    ],
  },
  {
    id: "mens-wallets",
    name: "Men's Wallets",
    slug: "mens-wallets",
    image: categoryMensWallets,
    // subcategories: [
    //   { id: "leather-wallets", name: "Leather Wallets", slug: "leather-wallets" },
    //   { id: "bi-fold", name: "Bi-fold Wallets", slug: "bi-fold" },
    //   { id: "card-holders", name: "Card Holders", slug: "card-holders" },
    // ],
  },
  {
    id: "ladies-wallets",
    name: "Ladies Wallets",
    slug: "ladies-wallets",
    image: categoryLadiesWallets,
    // subcategories: [
    //   { id: "clutches", name: "Clutches", slug: "clutches" },
    //   { id: "long-wallets", name: "Long Wallets", slug: "long-wallets" },
    //   { id: "coin-purses", name: "Coin Purses", slug: "coin-purses" },
    // ],
  },
  {
    id: "ticket-passport-folders",
    name: "Ticket & Passport Folders",
    slug: "ticket-passport-folders",
    image: categoryTicketFolders,
    // subcategories: [
    //   { id: "passport-holders", name: "Passport Holders", slug: "passport-holders" },
    //   { id: "travel-wallets", name: "Travel Wallets", slug: "travel-wallets" },
    // ],
  },
  {
    id: "file-folders",
    name: "File Folders",
    slug: "file-folders",
    image: categoryFileFolders,
    // subcategories: [
    //   { id: "document-holders", name: "Document Holders", slug: "document-holders" },
    //   { id: "conference-folders", name: "Conference Folders", slug: "conference-folders" },
    //   { id: "padfolios", name: "Padfolios", slug: "padfolios" },
    // ],
  },
  {
    id: "desk-accessories",
    name: "Desk Accessories",
    slug: "desk-accessories",
    image: categoryDeskAccessories,
    // subcategories: [
    //   { id: "pen-stands", name: "Pen Stands", slug: "pen-stands" },
    //   { id: "desk-organizers", name: "Desk Organizers", slug: "desk-organizers" },
    //   { id: "card-holders-desk", name: "Card Holders", slug: "card-holders-desk" },
    // ],
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous Items",
    slug: "miscellaneous",
    image: categoryMiscellaneous,
    // subcategories: [
    //   { id: "keychains", name: "Keychains", slug: "keychains" },
    //   { id: "accessories", name: "Accessories", slug: "accessories" },
    // ],
  },
  {
    id: "divinity",
    name: "Divinity Collection",
    slug: "divinity",
    image: categoryDivinity,
    // subcategories: [
    //   { id: "religious-items", name: "Religious Items", slug: "religious-items" },
    //   { id: "spiritual-gifts", name: "Spiritual Gifts", slug: "spiritual-gifts" },
    // ],
  },
  // {
  //   id: "promotional-keychains",
  //   name: "Keychains",
  //   slug: "promotional-keychains",
  //   image: categoryPromotionalKeychains,
  //   subcategories: [
  //     { id: "metal-keychains", name: "Metal Keychains", slug: "metal-keychains" },
  //     { id: "leather-keychains", name: "Leather Keychains", slug: "leather-keychains" },
  //     { id: "custom-keychains", name: "Custom Keychains", slug: "custom-keychains" },
  //   ],
  // },
];
