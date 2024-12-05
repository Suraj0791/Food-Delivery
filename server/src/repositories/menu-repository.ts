import CrudRepository from "./crud-repository.ts";
import mongoose from 'mongoose';

import { Menu, IMenuDocument } from "../models/menu.model.ts";

class MenuRepository extends CrudRepository<IMenuDocument> {
  constructor() {
    super(Menu);
  }

  async findByRestaurantId(restaurantId: string) {
    const objectId = new mongoose.Types.ObjectId(restaurantId);

    const menus = await Menu.find({ restaurant: objectId });
    console.log('Menus found:', menus);
    return menus;

}
  }
  
  




export default MenuRepository;