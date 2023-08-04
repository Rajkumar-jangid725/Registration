import clientPromise from "../../utils/mongo";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';

const methods = {
  POST: async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const url = new URL(req.headers.referer);
    const token = url.searchParams.get('token');

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("nextMongo");
      const collection = db.collection('user');

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await collection.updateOne(
        { token: token },
        { $set: { password: hashedPassword } },
        { writeConcern: { w: "majority", wtimeout: 5000 } }
      );

      if (result.modifiedCount === 0) {
        throw new Error('No documents updated');
      }

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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
