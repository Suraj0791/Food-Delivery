import CrudRepository from "./crud-repository.ts";

import { Menu, IMenuDocument } from "../models/menu.model.ts";

class MenuRepository extends CrudRepository<IMenuDocument> {
  constructor() {
    super(Menu);
  }

  async findByRestaurantId(restaurantId: string) {
    return this.model.find({ restaurant: restaurantId });
  }
}

export default MenuRepository;