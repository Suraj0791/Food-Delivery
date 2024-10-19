import CrudRepository from "./crud-repository.ts";

import { User, IUserDocument } from "../models/user.model.ts";

class UserRepository extends CrudRepository<IUserDocument> {
  constructor() {
    super(User);
  }
}

export default UserRepository;