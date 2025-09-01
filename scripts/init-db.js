import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function initializeDatabase() {
  try {
    console.log('Connecting to MySQL server...');
    
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('DB_URL environment variable is not set');
    }
    
    // Connect using the connection string
    const connection = await mysql.createConnection(dbUrl);

    console.log('Connected to MySQL server successfully!');

    // Create schools table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact VARCHAR(15) NOT NULL,
        image TEXT,
        email_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Schools table created or already exists.');

    await connection.end();
    console.log('Database initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open http://localhost:3000 in your browser');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase(); 