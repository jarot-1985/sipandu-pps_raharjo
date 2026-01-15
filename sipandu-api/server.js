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
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '.env') });

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

// Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});
const upload = multer({
  storage,
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
  client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  db = client.db(DB_NAME);
  col = db.collection('mutasi_pm');
  // indexes
  await col.createIndex({ bulanTahun: 1 });
  await col.createIndex({ unitPelayanan: 1, bulanTahun: -1 });
  await col.createIndex({ unitPelayanan: 'text' });
  console.log('[OK] Connected to MongoDB');
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: !!db, time: new Date().toISOString() });
});

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ pdfUrl, pdfName: req.file.originalname });
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
  try {
    const query = buildQuery(req.query);
    const data = await col.find(query).sort({ updatedAt: -1 }).toArray();
    res.json(data);
  } catch (err) {
    console.error('GET /mutasi error', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/mutasi', async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    if (!payload.unitPelayanan || !payload.bulanTahun) {
      return res.status(400).json({ error: 'unitPelayanan & bulanTahun required' });
    }
    payload.createdAt = new Date();
    payload.updatedAt = new Date();
    const r = await col.insertOne(payload);
    res.status(201).json({ _id: r.insertedId, ...payload });
  } catch (err) {
    console.error('POST /mutasi error', err);
    res.status(500).json({ error: 'Failed to create' });
  }
});

app.put('/mutasi/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = normalizePayload(req.body);
    payload.updatedAt = new Date();
    const r = await col.updateOne({ _id: new ObjectId(id) }, { $set: payload });
    if (!r.matchedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ _id: id, ...payload });
  } catch (err) {
    console.error('PUT /mutasi/:id error', err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/mutasi/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const r = await col.deleteOne({ _id: new ObjectId(id) });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /mutasi/:id error', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Start server after Mongo connected
initMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`[OK] Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('[FATAL] Mongo init failed', err);
    process.exit(1);
  });
