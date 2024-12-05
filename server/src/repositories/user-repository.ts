import CrudRepository from "./crud-repository.ts";
import { User, IUserDocument } from "../models/user.model.ts";

class UserRepository extends CrudRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  
  async findByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async findByverificationCode(token: string) {
    return this.model.findOne({ verificationCode: token, verificationCodeExpiresAt: { $gt: Date.now() } });
  }

  async findByResetToken(token: string) {
    return this.model.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
  }

  async findOne(query: { verificationCode: string }) {
    return this.model.findOne(query);
  }
}

export default UserRepository;