const mongoose = require('mongoose');

// Define the schema for a menu item
const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // Array of tags, e.g., ["Dessert", "Ice Cream"]
        required: true,
        index: true  // Indexing tags for faster search queries
    }
});

// Define the schema for a menu category
const menuCategorySchema = new mongoose.Schema({
    category: {
        type: String,  // Example: "Ice Cream", "Cake"
        required: true
    },
    items: [menuItemSchema]  // Array of items in this category
});

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
    shop_name: {
        type: String,
        required: true
    },
    cuisine: {
        type: [String],  // Array of cuisines like ["Cake", "Ice Cream", "Sorbet"]
        required: true,
        index: true  // Indexing cuisine for faster search by cuisine name
    },
    menu: [menuCategorySchema]  // Array of categories containing menu items
});

// Export the model with the specified collection name
module.exports = mongoose.model('Restaurant', restaurantSchema, 'menudetails');
