import {MailtrapClient} from "mailtrap";
import { ServerConfig } from "../config/index.ts";
 
export const client = new MailtrapClient({token: ServerConfig.MAILTRAP_API_TOKEN! });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "SURAJ",
};