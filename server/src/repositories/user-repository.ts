import CrudRepository from "./crud-repository.ts";

import { User, IUserDocument } from "../models/user.model.ts";

class UserRepository extends CrudRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email });
  }
  
  async findByVerificationToken(token: string): Promise<IUserDocument | null> {
    return this.model.findOne({ verificationToken: token, verificationTokenExpiresAt: { $gt: Date.now() } });
  }
  
  async findByResetToken(token: string): Promise<IUserDocument | null> {
    return this.model.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
  }
}




export default UserRepository;