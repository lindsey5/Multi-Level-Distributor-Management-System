import readline from 'readline';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (q: string) =>
  new Promise<string>((resolve) => rl.question(q, resolve));

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("Database connected.");

        const firstname = await question("Enter firstname: ");
        const lastname = await question("Enter lastname: ");
        const email = await question("Enter email: ");
        const password = await question("Enter password: ");

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            console.log("Email already exists. Try a different one.");
            rl.close();
            return;
        }

        const newAdmin = await Admin.create({
            firstname,
            lastname,
            email,
            password
        });

        console.log("Admin created successfully:");
        console.log(newAdmin);

    } catch (err: any) {
        console.error(err);
    } finally {
        rl.close();
        await mongoose.disconnect();
    }
})();