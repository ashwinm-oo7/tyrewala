const { MongoClient } = require("mongodb");

class Database {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = new MongoClient(this.uri);
    this.db = null;
  }

  async connect() {
    try {
      // console.log(this.uri);
      // console.log(this.dbName);
      await this.client.connect();
      // console.log("Connected to MongoDB");
      this.db = this.client.db(this.dbName);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getDb() {
    if (!this.db) {
      throw new Error("Database connection has not been established.");
    }
    return this.db;
  }
}

const uri =
  "mongodb+srv://ashwinmaurya1997:PASSWORD@cluster0.d7wnxkj.mongodb.net/?retryWrites=true&w=majority";
const dbName = "tyrecentre";

const database = new Database(uri, dbName);

// Export a function to connect to the database and return the database instance
async function connectDatabase() {
  await database.connect();
  return database;
}

module.exports = { connectDatabase };
