import CrudRepository from "./crud-repository.ts";
import { Order, IOrder} from "../models/order.model.ts";

class OrderRepository extends CrudRepository<IOrder> {
  constructor() {
    super(Order);
  }

  async findByUserId(userId: string) {
    return this.model.find({ user: userId }).populate('user').populate('restaurant');
  }
}

export default OrderRepository;

//populate user and restaurant fields in the order model with the user and restaurant data respectively. this is done to avoid making multiple queries to the database to get the user and restaurant data for each order. Populate is a mongoose method that allows you to reference documents in other collections. It is similar to a join in SQL. The user and restaurant fields in the order model are references to the user and restaurant models respectively. The populate method fetches the user and restaurant data from the user and restaurant collections and populates the user and restaurant fields in the order model with the user and restaurant data respectively. This way, when you fetch an order, you get the user and restaurant data along with the order data.