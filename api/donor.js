import mongoose from "mongoose";
import Cors from "cors";

// Middleware (Vercel serverless doesn’t allow app.use)
const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
});

// Run CORS middleware helper
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// MongoDB Connection
const uri = process.env.MONGO_URI;
let conn = null;

async function connectDB() {
  if (!conn) {
    conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return conn;
}

// Donor Schema
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodType: { type: String, required: true },
  place: { type: String, required: true },
  phone: { type: String, required: true },
  availability: { type: Boolean, default: true },
});

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

// API Handler
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await connectDB();

  if (req.method === "POST") {
    try {
      const newDonor = new Donor(req.body);
      const savedDonor = await newDonor.save();
      return res.status(201).json(savedDonor);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const donors = await Donor.find();
      return res.status(200).json(donors);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
