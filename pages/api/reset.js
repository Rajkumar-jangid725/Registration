import sgMail from '@sendgrid/mail';
import clientPromise from "../../utils/mongo";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

const methods = {
  POST: async (req, res) => {
    try {
      const client = await clientPromise;
      const db = client.db("nextMongo");

      const { email } = req.body;

      const existingUser = await db.collection("user").findOne({ email });

      if (existingUser) {
        const { firstName, lastName } = existingUser;
        const token = generateToken();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const passwordResetLink = `http://localhost:3000/updatePassword?token=${token}`;

        const msg = {
          to: email,
          from: process.env.EMAIL_FROM,
          templateId: process.env.TEMPLATE_ID,
          dynamicTemplateData: {
            passwordResetLink: passwordResetLink,
          },
        };

        sgMail.send(msg)
          .then(() => {
            sgMail.send(msg)
              .then(() => {
                const _id = existingUser._id;
                saveTokenInMongoDB(db, _id, token)
              })
            return res.status(200).json({ data: { firstName, lastName } });
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Failed to send email" });
          });
      } else {
        return res.json({ error: "Email is incorrect" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

function generateToken() {
  const token = uuidv4();
  return token;
}


async function saveTokenInMongoDB(db, _id, token) {
  await db.collection("user").updateOne(
    { _id: _id },
    { $set: { token: token } }
  );
}

export default async (req, res) => {
  const method = req.method.toUpperCase();

  if (methods[method]) {
    methods[method](req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
