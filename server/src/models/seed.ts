import mongoose from "mongoose";
import { Restaurant } from "./restraunt.model.ts"; // Adjust the path to your Restaurant model
import { Menu } from "./menu.model.ts"; // Adjust the path to your Menu model

const MONGO_URI = "mongodb+srv://surajsharma790340:iHi50UNjtqHmMsMb@cluster0.bcakj.mongodb.net/"; 

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    console.log("Existing data cleared");

    // Generate random menus
    const menus = [];
    for (let i = 0; i < 600; i++) { // 30 restaurants * 20 menus
      menus.push(
        new Menu({
          name: `Menu Item ${i + 1}`,
          description: `Description for Menu Item ${i + 1}`,
          price: Math.floor(Math.random() * 500) + 100, // Random price between 100 and 600
          image: `https://via.placeholder.com/150?text=Menu+${i + 1}`,
        })
      );
    }

    // Save all menus
    const savedMenus = await Menu.insertMany(menus);
    console.log("Menus created:", savedMenus.length);

    // Generate random restaurants
    const restaurants = [];
    for (let i = 0; i < 30; i++) {
      const randomMenus = savedMenus
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, Math.floor(Math.random() * 20) + 1); // Pick up to 20 menus

      restaurants.push(
        new Restaurant({
          user: new mongoose.Types.ObjectId(),
          restaurantName: `Restaurant ${i + 1}`,
          city: `City ${Math.floor(Math.random() * 10) + 1}`, // Random city names
          country: `Country ${Math.floor(Math.random() * 5) + 1}`, // Random country names
          deliveryTime: Math.floor(Math.random() * 60) + 20, // Random time between 20-80 minutes
          cuisines: Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
            (_, idx) => `Cuisine ${idx + 1}`
          ), // 1-3 random cuisines
          menus: randomMenus.map((menu) => menu._id),
          imageUrl: `https://via.placeholder.com/300?text=Restaurant+${i + 1}`,
        })
      );
    }

    // Save all restaurants
    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log("Restaurants created:", savedRestaurants.length);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the seed script
seedDatabase();
