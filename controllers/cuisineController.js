const Restaurant = require('../models/restaurantModel');

exports.searchCuisine = async (req, res) => {
    try {
        const cuisineType = req.query.type; // Example query, e.g., "Italian"
        const restaurants = await Restaurant.find({ cuisine: new RegExp(cuisineType, 'i') });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
