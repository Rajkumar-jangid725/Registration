import clientPromise from "../../utils/mongo";
import { ObjectId } from "mongodb";

const methods = {
  GET: async (req, res) => {
    try {
      const client = await clientPromise;
      const db = client.db("nextMongo");
      const users = await db.collection("user").find({}).toArray();
      res.json(users);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  POST: async (req, res) => {
    try {
      const client = await clientPromise;
      const db = client.db("nextMongo");

      const { firstName, lastName, email, password } = req.body;

      const existingUser = await db.collection("user").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const result = await db.collection("user").insertOne(
        {
          firstName,
          lastName,
          email,
          password,
        },
        { writeConcern: { w: "majority", wtimeout: 5000 } }
      );
      res.status(201).json({ message: "Data inserted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default async (req, res) => {
  const method = req.method.toUpperCase();

  if (methods[method]) {
    methods[method](req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
