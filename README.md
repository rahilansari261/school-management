# School Management System

A comprehensive Next.js application for managing school information with MySQL database integration.

## Features

- **Add Schools**: Form to input and store school data with validation
- **View Schools**: Ecommerce-style grid layout to display all schools
- **Image Upload**: Secure image storage in `schoolImages` folder
- **Form Validation**: Built-in validation using react-hook-form and Zod
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Search & Filter**: Advanced search and filtering capabilities
- **MySQL Integration**: Robust database backend with automatic table creation

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Form Handling**: react-hook-form with Zod validation
- **Database**: MySQL with mysql2 driver
- **Styling**: Tailwind CSS for responsive design
- **Image Handling**: Next.js Image component with file upload

## Prerequisites

- Node.js 18+ 
- MySQL database server
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
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   DB_PORT=3306
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE school_management;
   ```
   The application will automatically create the required tables on first run.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application automatically creates a `schools` table with the following structure:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT,
  email_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=your-production-db-name
DB_PORT=3306
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
