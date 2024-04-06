const express = require("express");
const router = express.Router();
const db = require("../../../db"); // Import the MongoDB database connection module
const EncryptionDecryption = require("../Utility/EncryptionDecryption");
const { ObjectId } = require("mongodb");

const Customer = require("../UserEntity/Customer");

router.post("/signup", async (req, res) => {
  // console.log("API Called from REACT JS");

  try {
    const entity = req.body;
    console.log(entity.password);
    let encPwd = "";
    EncryptionDecryption.encrypt(entity.password).then((encryptedPassword) => {
      // console.log("Plain encrypted string password:", encryptedPassword);
      encPwd = encryptedPassword;
    });
    console.log(await encPwd);
    entity.password = await encPwd;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();

    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Perform database operation to create a new customer
    const savedCustomer = await customerCollection.insertOne(entity);
    console.log("adcdafafafa : ", savedCustomer);
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json("Failed to signup. Please try again later.");
  }
});

router.post("/login", async (req, res) => {
  console.log("API Called from REACT JS");
  try {
    console.log(await req.body);
    const { email, password } = await req.body;
    console.log("adfdaffda ; ", email);
    console.log("adfdaffda ; ", password);

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    console.log("Successfully connected to the database");

    try {
      const db1 = await dbInstance.getDb();
      const customerCollection = db1.collection("customer");

      // Now you can perform database operations using customerCollection
      const query = { email: email };

      // Use find() instead of findOne() to get all documents
      const cursor = await customerCollection.findOne(query);

      // console.log("Cursor", cursor);
      let dbUserPass = "";
      EncryptionDecryption.decrypt(cursor.password).then(
        (encryptedPassword) => {
          // console.log("Plain decrypt string password:", encryptedPassword);
          dbUserPass = encryptedPassword;
          // console.log("dbUserPass :", dbUserPass);
          // console.log("req.body.password :", req.body.password);
          // console.log(
          //   "req.body.passwordasdda :",
          //   dbUserPass != req.body.password
          // );
          if (dbUserPass != req.body.password) {
            return res.status(401).json("Credentials issue !");
          }

          if (cursor) {
            return res.status(200).json(cursor);
          } else {
            return res.status(404).json("Customer not found");
          }
        }
      );
    } catch (error) {
      console.error("Error while fetching profile:", error);
    }
    // Perform database operation to find customer by ID
  } catch (error) {
    console.error("Error while fetching profile:", error.message);
    return res
      .status(500)
      .json("Failed to fetch profile. Please try again later.");
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID parameter is missing" });
    }

    const customer = await Customer.findById(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch profile. Please try again later." });
  }
});

// Helper function for constant-time password comparison
async function comparePasswords(inputPassword, dbPassword) {
  // Use a secure comparison algorithm to mitigate timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(inputPassword),
    Buffer.from(dbPassword)
  );
}

// PUT update user profile by ID
router.put("/profile/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedProfile = req.body;
    updatedProfile.update_at = new Date(Date.now() + 330 * 60 * 1000);

    console.log("Userid or Update", userId, updatedProfile);
    const updatedUser = await Customer.findByIdAndUpdate(
      userId,
      updatedProfile,
      { new: true }
    );

    if (Object.keys(updatedProfile).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

module.exports = router;
