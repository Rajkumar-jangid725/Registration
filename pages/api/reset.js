// import sgMail from '@sendgrid/mail';
// import clientPromise from "../../utils/mongo";
// import { ObjectId } from "mongodb";

// const methods = {
//   POST: async (req, res) => {
//     try {
//       const client = await clientPromise;
//       const db = client.db("nextMongo");

//       const { email } = req.body;

//       const existingUser = await db.collection("user").findOne({ email });

//       if (existingUser) {
//         const { firstName, lastName } = existingUser;
//         // console.log(firstName);
//         // console.log(process.env.SENDGRID_API_KEY)
//         // Send email using SendGrid
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//         const msg = {
//           to: email,
//           from: 'rajkumar233766@gmail.com',
//           // subject: 'Sending with SendGrid is Fun',
//           // text: 'and easy to do anywhere, even with Node.js',
//           // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//           templateId: 'd-dd1ee0cb208a4e2db8f1f079a00fdd01',
//         };

//         sgMail.send(msg)
//           .then(() => {
//             // console.log('Email sent');
//             return res.status(200).json({ data: { firstName, lastName } });
//           })
//           .catch((error) => {
//             console.error(error);
//             return res.status(500).json({ error: "Failed to send email" });
//           });
//       } else {
//         return res.json({ error: "Email is incorrect" });
//       }
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
// };

// export default async (req, res) => {
//   const method = req.method.toUpperCase();

//   if (methods[method]) {
//     methods[method](req, res);
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// };


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

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: email,
          from: 'rajkumar233766@gmail.com',
          templateId: 'd-27f73b48584745eaacdd27261ef3fb25',
          // templateId: emailTemplate,
        };

        sgMail.send(msg)
          .then(() => {
            const token = generateToken();
            //const emailWithToken = appendTokenToEmail(msg, token);

            const _id = existingUser._id;
            console.log(_id);
            saveTokenInMongoDB(db, _id, token);

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
  console.log(token);
  return token;
}

function appendTokenToEmail(msg, token) {
  const emailWithToken = {
    ...msg,
    html: msg.html.replace("{token}", token),
  };

  return emailWithToken;
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
