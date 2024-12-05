import mongoose from "mongoose";
import { Restaurant } from "./restraunt.model.ts";
import { Menu } from "./menu.model.ts";

import {ServerConfig} from "../config/index.ts"

const MONGO_URI=ServerConfig.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    console.log("Existing data cleared");

    // Generate random restaurants
    const restaurants = [];
    for (let i = 0; i < 30; i++) {
      restaurants.push(
        new Restaurant({
          user: "673f776b0864f9d5c6465369", // Replace with actual user IDs if available
          restaurantName: `Restaurant ${i + 1}`,
          city: `City ${Math.floor(Math.random() * 10) + 1}`,
          country: `Country ${Math.floor(Math.random() * 5) + 1}`,
          deliveryTime: Math.floor(Math.random() * 60) + 20,
          cuisines: Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
            (_, idx) => `Cuisine ${idx + 1}`
          ),
          menus: [], // To be populated later
          imageUrl: `https://via.placeholder.com/300?text=Restaurant+${i + 1}`,
        })
      );
    }

    // Save all restaurants
    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log("Restaurants created:", savedRestaurants.length);

    // Generate menus and associate them with restaurants
    const menus = [];

    for (const restaurant of savedRestaurants) {
      const numMenus = Math.floor(Math.random() * 20) + 1; // Each restaurant has 1 to 20 menus
      const restaurantMenus = [];
      for (let i = 0; i < numMenus; i++) {
        const menu: typeof Menu.prototype = new Menu({
          name: `Menu Item ${menus.length + 1}`,
          description: `Description for Menu Item ${menus.length + 1}`,
          price: Math.floor(Math.random() * 500) + 100,
          image: `https://via.placeholder.com/150?text=Menu+${menus.length + 1}`,
          restaurant: restaurant._id, // Associate menu with restaurant
        });
        menus.push(menu);
        restaurantMenus.push(menu._id);
      }
      // Update restaurant's menus array
      restaurant.menus = restaurantMenus;
    }

    // Save all menus
    const savedMenus = await Menu.insertMany(menus);
    console.log("Menus created:", savedMenus.length);

    // Update restaurants with their menus
    for (const restaurant of savedRestaurants) {
      await Restaurant.updateOne({ _id: restaurant._id }, { menus: restaurant.menus });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Invoke the seedDatabase function
seedDatabase();