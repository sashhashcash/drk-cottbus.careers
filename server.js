const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');
const translate = require('@vitalets/google-translate-api');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, 'data', 'applications.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 20);

const defaultAdminEmail = 'admin@drk-cottbus.de';
const defaultAdminPassword = 'ChangeMe123!';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || defaultAdminEmail;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || defaultAdminPassword;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const USING_FALLBACK_ADMIN = !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD;

if (USING_FALLBACK_ADMIN) {
  console.warn('⚠️  Using fallback admin credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment for production.');
}

fs.ensureDirSync(path.dirname(DATA_PATH));
fs.ensureDirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, `${Date.now()}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOAD_DIR));

const attachmentsConfig = [
  { name: 'lebenslauf', maxCount: 1 },
  { name: 'zeugnisse', maxCount: 1 },
  { name: 'bewerbungsfoto', maxCount: 1 },
  { name: 'bewerbungsvideo', maxCount: 1 }
];

const transporter = (() => {
  if (!process.env.SMTP_HOST) {
    console.warn('⚠️  SMTP credentials missing. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
})();

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function getFieldArray(body, baseName) {
  return ensureArray(body[`${baseName}[]`] ?? body[baseName]);
}

async function readApplications() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_PATH, '[]');
      return [];
    }
    throw error;
  }
}

async function writeApplications(applications) {
  await fs.writeFile(DATA_PATH, JSON.stringify(applications, null, 2));
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, email });
});

app.get('/api/applications', authMiddleware, async (_req, res) => {
  const applications = await readApplications();
  res.json(applications);
});

app.post('/api/applications/:id/translate', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const applications = await readApplications();
  const application = applications.find((item) => item.id === id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  try {
    const fieldsToTranslate = ['coverLetter', 'notes'];
    const translatedApplication = { ...application };

    const translateField = async (value) => {
      if (!value) return value;
      const result = await translate(value, { to: 'de' });
      return result.text;
    };

    for (const field of fieldsToTranslate) {
      if (application[field]) {
        translatedApplication[`${field}Translated`] = await translateField(application[field]);
      }
    }

    translatedApplication.workExperience = await Promise.all(
      (application.workExperience || []).map(async (experience) => ({
        ...experience,
        beschreibungTranslated: experience.beschreibung
          ? (await translate(experience.beschreibung, { to: 'de' })).text
          : ''
      }))
    );

    translatedApplication.education = await Promise.all(
      (application.education || []).map(async (item) => ({
        ...item,
        fachrichtungTranslated: item.fachrichtung
          ? (await translate(item.fachrichtung, { to: 'de' })).text
          : ''
      }))
    );

    res.json(translatedApplication);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Translation failed', error: error.message });
  }
});

app.post('/api/applications', upload.fields(attachmentsConfig), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    const formLanguage = body.formLanguage || 'de';
    const germanLevel = body.germanLevel || null;

    const jetzt = dayjs();
    const id = uuidv4();

    const workExperience = (() => {
      const employers = getFieldArray(body, 'arbeitgeber');
      const positions = getFieldArray(body, 'position');
      const descriptions = getFieldArray(body, 'beschreibung');
      const startDates = getFieldArray(body, 'startdatum');
      const endDates = getFieldArray(body, 'enddatum');

      return employers
        .map((arbeitgeber, index) => ({
          arbeitgeber,
          position: positions[index] || '',
          beschreibung: descriptions[index] || '',
          startdatum: startDates[index] || '',
          enddatum: endDates[index] || ''
        }))
        .filter((item) => Object.values(item).some((value) => value));
    })();

    const education = (() => {
      const schools = getFieldArray(body, 'bildungseinrichtung');
      const degrees = getFieldArray(body, 'abschluss');
      const fields = getFieldArray(body, 'fachrichtung');
      const startDates = getFieldArray(body, 'bildungsstart');
      const endDates = getFieldArray(body, 'bildungsende');

      return schools
        .map((schule, index) => ({
          bildungseinrichtung: schule,
          abschluss: degrees[index] || '',
          fachrichtung: fields[index] || '',
          bildungsstart: startDates[index] || '',
          bildungsende: endDates[index] || ''
        }))
        .filter((item) => Object.values(item).some((value) => value));
    })();

    const attachments = Object.entries(files).flatMap(([fieldName, fileArray]) =>
      fileArray.map((file) => {
        const relativePath = path.relative(__dirname, file.path).split(path.sep).join('/');
        return {
          fieldName,
          filename: file.originalname,
          storagePath: file.path,
          publicPath: `/${relativePath}`,
          mimetype: file.mimetype,
          size: file.size
        };
      })
    );

    const application = {
      id,
      createdAt: jetzt.toISOString(),
      createdAtFormatted: jetzt.format('DD.MM.YYYY HH:mm'),
      formLanguage,
      germanLevel,
      selectedJob: body.selectedJob,
      anrede: body.anrede,
      employmentType: body.employmentType,
      vorname: body.vorname,
      nachname: body.nachname,
      email: body.email,
      telefon: body.telefon,
      adresse: body.adresse,
      plz: body.plz,
      ort: body.ort,
      land: body.land,
      workExperience,
      education,
      attachments,
      archived: false,
      archivedAt: null
    };

    const applications = await readApplications();
    applications.unshift(application);
    await writeApplications(applications);

    if (transporter && process.env.MAIL_TO) {
      const toAddresses = process.env.MAIL_TO.split(',').map((item) => item.trim()).filter(Boolean);
      const htmlSections = [
        `<h2>Neue Bewerbung: ${application.selectedJob}</h2>`,
        `<p><strong>Sprache des Formulars:</strong> ${formLanguage.toUpperCase()}</p>`,
        germanLevel ? `<p><strong>Deutschniveau:</strong> ${germanLevel}</p>` : '',
        '<h3>Stammdaten</h3>',
        '<ul>' +
          [
            `<li><strong>Name:</strong> ${application.vorname} ${application.nachname}</li>`,
            `<li><strong>E-Mail:</strong> ${application.email}</li>`,
            `<li><strong>Telefon:</strong> ${application.telefon}</li>`,
            `<li><strong>Adresse:</strong> ${application.adresse}, ${application.plz} ${application.ort}, ${application.land}</li>`
          ].join('') +
        '</ul>',
        '<h3>Berufserfahrung</h3>',
        application.workExperience.length
          ? '<ol>' + application.workExperience.map((item) => `
              <li>
                <strong>${item.arbeitgeber || '—'}</strong> – ${item.position || '—'}<br/>
                ${item.startdatum || '—'} – ${item.enddatum || '—'}<br/>
                ${item.beschreibung || ''}
              </li>
            `).join('') + '</ol>'
          : '<p>Keine Angaben</p>',
        '<h3>Ausbildung</h3>',
        application.education.length
          ? '<ol>' + application.education.map((item) => `
              <li>
                <strong>${item.bildungseinrichtung || '—'}</strong> – ${item.abschluss || '—'}<br/>
                ${item.bildungsstart || '—'} – ${item.bildungsende || '—'}<br/>
                ${item.fachrichtung || ''}
              </li>
            `).join('') + '</ol>'
          : '<p>Keine Angaben</p>'
      ].filter(Boolean).join('');

      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || 'no-reply@drk-cottbus.de',
          to: toAddresses,
          subject: `Neue Bewerbung: ${application.vorname} ${application.nachname} – ${application.selectedJob}`,
          html: htmlSections,
          attachments: attachments.map((file) => ({
            filename: file.filename,
            path: file.storagePath,
            contentType: file.mimetype
          }))
        });
      } catch (mailError) {
        console.error('Email dispatch failed:', mailError.message);
      }
    }

    res.json({ message: 'Application received', applicationId: id });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Could not submit application', error: error.message });
  }
});

app.post('/api/applications/:id/archive', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { archived = true } = req.body;

  const applications = await readApplications();
  const target = applications.find((item) => item.id === id);

  if (!target) {
    return res.status(404).json({ message: 'Application not found' });
  }

  target.archived = Boolean(archived);
  target.archivedAt = target.archived ? new Date().toISOString() : null;

  await writeApplications(applications);
  res.json({ message: `Application ${target.archived ? 'archived' : 'restored'}` });
});

app.delete('/api/applications/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const applications = await readApplications();
  const index = applications.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const [removed] = applications.splice(index, 1);
  await writeApplications(applications);

  if (removed.attachments && removed.attachments.length) {
    await Promise.all(
      removed.attachments.map(async (file) => {
        if (file.storagePath) {
          try {
            await fs.remove(file.storagePath);
          } catch (cleanupError) {
            console.warn('Cleanup attachment failed:', cleanupError.message);
          }
        }
      })
    );
  }

  res.json({ message: 'Application deleted' });
});

app.get('/api/applications/:id/export', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const applications = await readApplications();
  const application = applications.find((item) => item.id === id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="application-${id}.pdf"`);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  const addSectionTitle = (title) => {
    doc.moveDown(1);
    doc.fontSize(14).fillColor('#111827').text(title, { underline: true });
    doc.moveDown(0.4);
  };

  const addKeyValue = (label, value) => {
    if (!value && value !== 0) return;
    doc.fontSize(11).fillColor('#1f2937').text(`${label}: `, { continued: true }).fillColor('#374151').text(String(value));
  };

  const addList = (items, formatter) => {
    if (!items || !items.length) {
      doc.fontSize(11).fillColor('#6b7280').text('Sin información.');
      return;
    }
    items.forEach((item, index) => {
      doc.fontSize(11).fillColor('#111827').text(`${index + 1}. ${formatter(item)}`);
    });
  };

  doc.fontSize(20).fillColor('#dc2626').text('Bewerbung / Application', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#6b7280').text(`Eingang: ${application.createdAtFormatted || dayjs(application.createdAt).format('DD.MM.YYYY HH:mm')}`);
  doc.moveDown();

  addSectionTitle('Stammdaten');
  addKeyValue('Name', `${application.vorname || ''} ${application.nachname || ''}`.trim());
  addKeyValue('E-Mail', application.email);
  addKeyValue('Telefon', application.telefon);
  addKeyValue('Adresse', application.adresse);
  addKeyValue('PLZ / Ort', `${application.plz || ''} ${application.ort || ''}`.trim());
  addKeyValue('Land', application.land);
  addKeyValue('Position', application.selectedJob);
  addKeyValue('Sprache des Formulars', (application.formLanguage || 'de').toUpperCase());
  addKeyValue('Deutsch-Niveau', application.germanLevel || 'Keine Angabe');
  addKeyValue('Arbeitszeit', application.employmentType);

  addSectionTitle('Beruflicher Werdegang');
  addList(application.workExperience, (item) => {
    const lines = [item.arbeitgeber, item.position].filter(Boolean).join(' – ');
    const period = [item.startdatum, item.enddatum].filter(Boolean).join(' bis ');
    const description = item.beschreibung ? `\n${item.beschreibung}` : '';
    return [lines, period, description].filter(Boolean).join('\n');
  });

  addSectionTitle('Ausbildung & Qualifikationen');
  addList(application.education, (item) => {
    const lines = [item.bildungseinrichtung, item.abschluss].filter(Boolean).join(' – ');
    const period = [item.bildungsstart, item.bildungsende].filter(Boolean).join(' bis ');
    const description = item.fachrichtung ? `\n${item.fachrichtung}` : '';
    return [lines, period, description].filter(Boolean).join('\n');
  });

  addSectionTitle('Dateianhänge');
  if (application.attachments && application.attachments.length) {
    application.attachments.forEach((file, index) => {
      doc.fontSize(11).fillColor('#111827').text(`${index + 1}. ${file.filename} (${Math.round(file.size / 1024)} KB)`);
    });
  } else {
    doc.fontSize(11).fillColor('#6b7280').text('Keine Dateien hochgeladen.');
  }

  if (application.archived) {
    addSectionTitle('Status');
    doc.fontSize(11).fillColor('#6b7280').text('Diese Bewerbung ist archiviert.');
    if (application.archivedAt) {
      doc.fontSize(11).fillColor('#6b7280').text(`Archiviert am: ${dayjs(application.archivedAt).format('DD.MM.YYYY HH:mm')}`);
    }
  }

  doc.end();
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
