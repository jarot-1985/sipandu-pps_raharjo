/*
 SIPANDU API - Express + MongoDB (Mutasi PM)
 Endpoint:
  - GET    /health
  - POST   /upload                  (PDF upload, <= 5MB)
  - GET    /mutasi?unit=&q=&start=&end=
  - POST   /mutasi                  (create)
  - PUT    /mutasi/:id              (update)
  - DELETE /mutasi/:id              (delete)

 Environment (.env expected in same folder):
  - PORT=4000
  - MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
  - DB_NAME=sipandu

 Run:
  - npm init -y
  - npm i express mongodb cors dotenv multer morgan
  - npm i -D nodemon
  - add scripts: { "dev": "nodemon server.js", "start": "node server.js" }
  - create .env then: npm run dev
*/

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const dotenv = require('dotenv');
// MongoDB disabled
const cloudinary = require('cloudinary').v2;

dotenv.config({ path: path.join(__dirname, '.env') });
// Cloudinary will read credentials from CLOUDINARY_URL
cloudinary.config({ secure: true });

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'sipandu';

if (!MONGODB_URI) {
  console.warn('[WARN] MONGODB_URI is not set. Please set it in .env');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ensure uploads dir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Multer for PDF uploads (memory storage for Cloudinary upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF allowed'));
    cb(null, true);
  }
});

// MongoDB bootstrap
let client;
let db;
let col;

async function initMongo() {
  console.log('[INFO] MongoDB connection disabled');
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: !!db, time: new Date().toISOString() });
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const originalName = req.file.originalname || 'document.pdf';
    const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folder = 'sipandu/mutasi_pm';

    // Upload as data URI to Cloudinary (resource_type raw for PDF)
    const b64 = req.file.buffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      folder,
      public_id: `${Date.now()}_${baseName}`,
      overwrite: true
    });

    return res.json({ pdfUrl: result.secure_url, pdfName: originalName, publicId: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Helpers
function normalizePayload(body) {
  const n = (v) => (v === undefined || v === null || v === '' ? 0 : Number(v));
  return {
    unitPelayanan: body.unitPelayanan || '',
    bulanTahun: body.bulanTahun || '', // YYYY-MM
    jumlahAwal: n(body.jumlahAwal),
    pmMasuk: n(body.pmMasuk),
    pmKeluar: n(body.pmKeluar),
    jumlahAkhir: n(body.jumlahAkhir),
    catatan: body.catatan || '',
    pdfUrl: body.pdfUrl || '',
    pdfName: body.pdfName || ''
  };
}

function buildQuery(qs) {
  const { q, unit, start, end } = qs;
  const query = {};
  if (unit && unit !== 'Semua') query.unitPelayanan = unit;
  if (start && end) query.bulanTahun = { $gte: start, $lte: end };
  else if (start) query.bulanTahun = start;
  else if (end) query.bulanTahun = end;
  if (q) {
    query.$or = [
      { unitPelayanan: { $regex: q, $options: 'i' } },
      { bulanTahun: { $regex: q, $options: 'i' } }
    ];
  }
  return query;
}

// CRUD Mutasi
app.get('/mutasi', async (req, res) => {
  res.json([]);
});

app.post('/mutasi', async (req, res) => {
  res.status(501).json({ error: 'Database disabled' });
});

app.put('/mutasi/:id', async (req, res) => {
  res.status(501).json({ error: 'Database disabled' });
});

app.delete('/mutasi/:id', async (req, res) => {
  res.status(501).json({ error: 'Database disabled' });
});

// Start server after Mongo connected
app.listen(PORT, () => console.log(`[OK] Server listening on port ${PORT}`));
