import mongoose from "mongoose";
import { config } from "dotenv";

config()

class DatabaseService {
    constructor() {
      this.uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@web-78.7igvc5y.mongodb.net/${process.env.DB_NAME}`;
    }
    async connect() {
      try {
        await mongoose.connect(this.uri);
        console.log(`MongoDB connect successfully`);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  
  const databaseService = new DatabaseService();
  
  export default databaseService;