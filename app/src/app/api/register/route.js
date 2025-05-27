import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/app/lib/mongoose';
import User from '@/app/models/User';

export async function POST(req) {
  await connectToDatabase();

  const body = await req.json();
  const { name, email, password } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ message: 'User created', userId: newUser._id }, { status: 201 });
}
