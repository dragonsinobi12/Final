import crypto from 'node:crypto';
import express from 'express';
import { SEED_BUGS, SEED_SPOTS } from '../src/data/seed';

const app = express();
const port = Number(process.env.PORT ?? 3001);
app.use(express.json());

const sessions = new Map<string, { token: string; expiresAt: number; user: { id: string; name: string; email: string } }>();

app.get('/spots', (_request, response) => response.json(SEED_SPOTS));
app.get('/bugs', (_request, response) => response.json(SEED_BUGS));

app.post('/auth/login', (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };
  if (email !== 'explorer@bugquest.dev' || password !== '1234') {
    return response.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  const token = crypto.randomUUID();
  const session = {
    token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    user: { id: 'user-1', name: 'นักสำรวจนที', email },
  };
  sessions.set(token, session);
  return response.json(session);
});

app.post('/registrations', (request, response) => {
  const authorization = request.headers.authorization ?? '';
  const token = authorization.replace('Bearer ', '');
  if (!sessions.has(token)) return response.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อนลงทะเบียน' });
  const { spotId } = request.body as { spotId?: string };
  const spot = SEED_SPOTS.find((item) => item.id === spotId);
  if (!spot) return response.status(404).json({ message: 'ไม่พบพื้นที่สำรวจ' });
  return response.status(201).json({ id: crypto.randomUUID(), unlockedBugIds: spot.bugIds });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`BugQuest mock API listening on http://localhost:${port}`);
});
