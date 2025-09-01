import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    if (imageFile) {
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

    // Save to database using Prisma
    const school = await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        image: imagePath,
        email_id,
      },
    });

    return NextResponse.json(
      { 
        message: 'School added successfully',
        schoolId: school.id 
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for search - handle empty search properly
    let whereClause = {};
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      whereClause = {
        OR: [
          { name: { contains: searchTerm } },
          { address: { contains: searchTerm } },
          { city: { contains: searchTerm } },
          { state: { contains: searchTerm } },
        ],
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.school.count({
      where: whereClause,
    });

    // Get schools with pagination and search
    const schools = await prisma.school.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      schools,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 