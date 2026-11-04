require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const { randomUUID } = require('crypto');
const { getMembers, saveMembers } = require('./lib/storage');
const { requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CambiaEstaClave123!';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'desarrollo-cambiar-esta-clave',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 4 }
}));

app.locals.formatPhone = (phone) => String(phone || '').replace(/\D/g, '');
app.locals.whatsappUrl = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
};

function cleanText(value, max = 100) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}
function publicMembers() {
  return getMembers().sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

app.get('/', (req, res) => {
  const members = publicMembers();
  res.render('index', {
    members,
    pilots: members.filter(m => m.type === 'pilot'),
    copilots: members.filter(m => m.type === 'copilot')
  });
});

app.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const username = cleanText(req.body.username, 60);
  const password = String(req.body.password || '');
  const validUser = username === ADMIN_USER;
  const submitted = Buffer.from(password, 'utf8');
  const expected = Buffer.from(ADMIN_PASSWORD, 'utf8');
  const validPassword = validUser && submitted.length === expected.length &&
    crypto.timingSafeEqual(submitted, expected);
  if (!validPassword) return res.status(401).render('login', { error: 'Usuario o contraseña incorrectos.' });
  req.session.isAdmin = true;
  req.session.username = username;
  res.redirect('/admin');
});

app.get('/admin', requireAdmin, (req, res) => {
  const members = publicMembers();
  res.render('admin', { members, message: req.query.ok || null, error: req.query.error || null });
});

app.post('/admin/members', requireAdmin, (req, res) => {
  const name = cleanText(req.body.name, 90);
  const type = req.body.type === 'copilot' ? 'copilot' : 'pilot';
  const status = req.body.status === 'unavailable' ? 'unavailable' : 'available';
  const phone = String(req.body.phone || '').replace(/[^\d+]/g, '').slice(0, 18);
  if (name.length < 3) return res.redirect('/admin?error=' + encodeURIComponent('Escribe un nombre válido.'));
  if (phone && phone.replace(/\D/g, '').length < 8) return res.redirect('/admin?error=' + encodeURIComponent('El WhatsApp debe tener al menos 8 dígitos.'));
  const members = getMembers();
  members.push({ id: randomUUID(), name, type, status, phone, createdAt: new Date().toISOString() });
  saveMembers(members);
  res.redirect('/admin?ok=' + encodeURIComponent('Miembro agregado correctamente.'));
});

app.post('/admin/members/:id/update', requireAdmin, (req, res) => {
  const members = getMembers();
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.redirect('/admin?error=' + encodeURIComponent('No se encontró el miembro.'));
  const name = cleanText(req.body.name, 90);
  const phone = String(req.body.phone || '').replace(/[^\d+]/g, '').slice(0, 18);
  if (name.length < 3) return res.redirect('/admin?error=' + encodeURIComponent('Escribe un nombre válido.'));
  member.name = name;
  member.type = req.body.type === 'copilot' ? 'copilot' : 'pilot';
  member.status = req.body.status === 'unavailable' ? 'unavailable' : 'available';
  member.phone = phone;
  saveMembers(members);
  res.redirect('/admin?ok=' + encodeURIComponent('Cambios guardados.'));
});

app.post('/admin/members/:id/delete', requireAdmin, (req, res) => {
  const members = getMembers().filter(m => m.id !== req.params.id);
  saveMembers(members);
  res.redirect('/admin?ok=' + encodeURIComponent('Miembro eliminado.'));
});

app.post('/admin/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.use((req, res) => res.status(404).send('Página no encontrada.'));
app.listen(PORT, () => console.log(`PASION RL BIKERS activo en http://localhost:${PORT}`));
