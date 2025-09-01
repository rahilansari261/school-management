import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const contact = formData.get('contact') as string;
    const email_id = formData.get('email_id') as string;
    const imageFile = formData.get('image') as File;

    // Validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Contact validation (basic phone number validation)
    const contactRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!contactRegex.test(contact)) {
      return NextResponse.json(
        { error: 'Invalid contact number' },
        { status: 400 }
      );
    }

    let imagePath = '';
    
    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create schoolImages directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'schoolImages');
      await mkdir(uploadDir, { recursive: true });
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const filePath = join(uploadDir, fileName);
      
      // Save file
      await writeFile(filePath, buffer);
      imagePath = `/schoolImages/${fileName}`;
    }

    // Save to database
    const connection = await createConnection();
    const [result] = await connection.execute(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, imagePath, email_id]
    );
    
    await connection.end();

    return NextResponse.json(
      { 
        message: 'School added successfully',
        schoolId: (result as { insertId: number }).insertId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding school:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM schools ORDER BY created_at DESC');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 