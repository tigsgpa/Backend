const Restaurant = require('../models/restaurantModel');

exports.searchRestaurants = async (req, res) => {
    try {
        const searchQuery = req.query.q; // Example search query, e.g., by name or location
        const restaurants = await Restaurant.find({ name: new RegExp(searchQuery, 'i') });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
