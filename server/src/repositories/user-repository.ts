import CrudRepository from "./crud-repository.ts";

import { User, IUserDocument } from "../models/user.model.ts";

class UserRepository extends CrudRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email });
  }
  
  async findByVerificationToken(token: string) {
    return this.model.findOne({ verificationToken: token, verificationTokenExpiresAt: { $gt: Date.now() } });
  }
  
  async findByResetToken(token: string) {
    return this.model.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
  }
}




export default UserRepository;