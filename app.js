const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8080;

const Restaurant = require('./model/restaurantModel'); // Import the Mongoose model
const BugReport = require('./model/BugReport'); // Import the BugReport Mongoose model

require('./connection'); // Assuming you have MongoDB connection here

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies

// Add route to handle search requests
app.get('/search-cuisine', async (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : '';

  try {
    // Fetch all restaurants from the database
    const restaurants = await Restaurant.find();

    // Filter restaurants based on shop_name only, case-insensitive
    const filteredRestaurants = restaurants.filter(restaurant => {
      return restaurant.shop_name?.toLowerCase().includes(query);
    });

    if (filteredRestaurants.length > 0) {
      res.status(200).json({ success: true, data: filteredRestaurants });
    } else {
      res.status(404).json({ success: false, message: 'No restaurants found' });
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add route to handle fetching a restaurant by _id
app.get('/restaurant/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);

    if (restaurant) {
      res.status(200).json({ success: true, data: restaurant });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route to fetch restaurant menu based on tag and name
app.get('/api/restaurant/:restaurantId/menu', async (req, res) => {
  const { restaurantId } = req.params;
  const { tag } = req.query;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const lowerCaseTag = tag ? tag.toLowerCase() : '';

    const menuItems = restaurant.menu.flatMap(category =>
      category.items.filter(item =>
        item.tags.some(t => t && t.toLowerCase().includes(lowerCaseTag)) ||
        (item.name && item.name.toLowerCase().includes(lowerCaseTag))
      )
    );

    res.json({ restaurant, menuItems });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to fetch restaurants based on tags or item names
app.get('/api/restaurants-by-tag', async (req, res) => {
  const { tag } = req.query;

  try {
    const lowerCaseTag = tag ? tag.toLowerCase() : '';

    const restaurants = await Restaurant.find({
      cuisine : { $elemMatch : { $regex: lowerCaseTag, $options: 'i' } }
      
    });

    console.log(`Found ${restaurants.length} restaurants with tag: ${tag}`);
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurants by tag:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route to handle bug report submission
app.post('/api/report-bug', async (req, res) => {
  const { name, email, bugType, description } = req.body;

  if (!name || !email || !bugType || !description) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  const newBugReport = new BugReport({ name, email, bugType, description });

  try {
    await newBugReport.save();
    return res.json({ status: 'success', message: 'Bug reported successfully!' });
  } catch (error) {
    console.error('Error saving to database:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to report the bug.' });
  }
});

// Optional: Route to retrieve bug reports (for testing)
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await BugReport.find();
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reports.' });
  }
});

// Start the server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on Port ${PORT}`);
});
