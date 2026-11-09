import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
}).strict();
const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });
const tokenFor = (u) => jwt.sign({ id: u._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });
const invalid = (res, error) => res.status(400).json({ message: 'Invalid input', errors: error.issues.map(x => ({ field: x.path.join('.'), message: x.message })) });

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  try {
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ message: 'Registration successful', token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    console.error('Registration:', error.message);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  try {
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({ message: 'Login successful', token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login:', error.message);
    return res.status(500).json({ message: 'Login failed' });
  }
}

export function me(req, res) { res.json({ user: publicUser(req.user) }); }