import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = '65964af99d2f9ec6c649a0f1ed49c243';

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Auth System",
};

