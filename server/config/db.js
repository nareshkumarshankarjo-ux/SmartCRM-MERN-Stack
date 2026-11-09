import mongoose from 'mongoose';
import dns from 'node:dns';

export default async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');
  // Optional local workaround for Windows/ISP SRV DNS issues; do not need on Render.
  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean));
  }
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 12000,
  });
  console.log('MongoDB Connected Successfully:', connection.connection.host);
}