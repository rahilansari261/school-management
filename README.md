# School Management System

A comprehensive Next.js application for managing school information with Prisma ORM integration.

## Features

- **Add Schools**: Form to input and store school data with validation
- **View Schools**: Ecommerce-style grid layout to display all schools
- **Image Upload**: Secure image storage in `schoolImages` folder
- **Form Validation**: Built-in validation using react-hook-form and Zod
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Search & Filter**: Advanced search and filtering capabilities
- **Prisma Integration**: Modern database ORM with automatic schema management

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Form Handling**: react-hook-form with Zod validation
- **Database**: Prisma ORM with PostgreSQL support
- **Styling**: Tailwind CSS for responsive design
- **Image Handling**: Next.js Image component with file upload

## Prerequisites

- Node.js 18+ 
- PostgreSQL database server (or other supported databases)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd school-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/school_management"
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses Prisma ORM with the following schema:

```prisma
model School {
  id         Int      @id @default(autoincrement())
  name       String
  address    String
  city       String
  state      String
  contact    String
  image      String?
  email_id   String
  created_at DateTime @default(now())

  @@map("schools")
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio for database management

## Pages

### 1. Home Page (`/`)
- Landing page with navigation to both main features
- Overview of system capabilities

### 2. Add School (`/addSchool`)
- Form to input school information
- Image upload functionality
- Real-time validation
- Success/error messaging

### 3. Show Schools (`/showSchools`)
- Grid layout displaying all schools
- Search functionality
- City and state filtering
- Responsive design for all devices

## API Endpoints

### POST `/api/schools`
- Adds a new school to the database
- Handles image upload
- Validates all input data

### GET `/api/schools`
- Retrieves all schools from the database
- Returns data in JSON format

## Form Validation

The application uses Zod schema validation for:
- **School Name**: Minimum 2 characters
- **Address**: Minimum 10 characters
- **City**: Minimum 2 characters
- **State**: Minimum 2 characters
- **Contact**: Valid phone number format
- **Email**: Valid email format
- **Image**: Required file upload

## Image Storage

- Images are stored in the `public/schoolImages/` directory
- Unique filenames are generated using timestamps
- Supported formats: All common image formats (JPEG, PNG, GIF, etc.)

## Responsive Design

- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly interface
- Optimized for all device types

## Database Management

### Prisma Studio
Access your database through a visual interface:
```bash
npm run db:studio
```

### Schema Changes
After modifying the Prisma schema:
```bash
npm run db:generate  # Generate new client
npm run db:push      # Push changes to database
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## Environment Variables for Production

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the GitHub repository.

## Screenshots

The application features a modern, clean interface with:
- Beautiful landing page with feature overview
- Intuitive form design with validation
- Professional school grid layout
- Responsive design for all devices

---

**Built with ❤️ using Next.js and modern web technologies**
