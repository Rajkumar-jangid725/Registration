import clientPromise from "../../utils/mongo";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const methods = {
  POST: async (req, res) => {
    try {
      const client = await clientPromise;
      const db = client.db("nextMongo");

      const { email, password } = req.body;

      const existingUser = await db.collection("user").findOne({ email });
      if (existingUser) {
        const { firstName, lastName, password: hashedPassword } = existingUser;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          return res.status(200).json({ data: { firstName, lastName } });
        } else {
          return res.json({ error: "Email or password incorrect" });
        }
      } else {
        return res.json({ error: "Email or password incorrect" });
      }
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
