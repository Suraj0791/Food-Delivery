import CrudRepository from "./crud-repository.ts";
import { User, IUserDocument } from "../models/user.model.ts";
import { Restaurant ,IRestaurantDocument} from "../models/restraunt.model.ts";


class RestaurantRepository extends CrudRepository<IRestaurantDocument> {
  constructor() {
    super(Restaurant);
  }
  async findByUserId(userId: string): Promise<IRestaurantDocument | null> {
    return this.model.findOne({ user: userId });
}

async search(query: any): Promise<IRestaurantDocument[]> {
    return this.model.find(query);
}
}

export default RestaurantRepository;
