import { PrismaClient } from '@prisma/client';
import { writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { copyFile } from 'fs/promises';

const prisma = new PrismaClient();

// School names for variety
const schoolNames = [
  'Delhi Public School', 'St. Xavier\'s School', 'Kendriya Vidyalaya', 'Army Public School',
  'Navy Children School', 'Air Force School', 'Delhi International School', 'Modern School',
  'Springdales School', 'Loreto Convent', 'St. Mary\'s School', 'Sacred Heart School',
  'St. Joseph\'s School', 'St. Anthony\'s School', 'St. Francis School', 'St. Paul\'s School',
  'St. Thomas School', 'St. John\'s School', 'St. Mark\'s School', 'St. Luke\'s School',
  'St. Matthew\'s School', 'St. Peter\'s School', 'St. Andrew\'s School', 'St. James School',
  'St. Patrick\'s School', 'St. Michael\'s School', 'St. Gabriel\'s School', 'St. Raphael\'s School',
  'St. Uriel\'s School', 'St. Gabriel School', 'St. Raphael School', 'St. Uriel School',
  'Delhi Grammar School', 'Delhi Academy', 'Delhi College', 'Delhi Institute',
  'Delhi University School', 'Delhi Technical School', 'Delhi Science School', 'Delhi Arts School',
  'Delhi Commerce School', 'Delhi Medical School', 'Delhi Engineering School', 'Delhi Law School',
  'Delhi Business School', 'Delhi Management School', 'Delhi Computer School', 'Delhi IT School',
  'Delhi Digital School', 'Delhi Smart School', 'Delhi Future School', 'Delhi Global School',
  'Delhi World School', 'Delhi International Academy', 'Delhi Global Academy', 'Delhi World Academy',
  'Delhi Future Academy', 'Delhi Smart Academy', 'Delhi Digital Academy', 'Delhi IT Academy',
  'Delhi Computer Academy', 'Delhi Management Academy', 'Delhi Business Academy', 'Delhi Law Academy',
  'Delhi Engineering Academy', 'Delhi Medical Academy', 'Delhi Arts Academy', 'Delhi Commerce Academy',
  'Delhi Science Academy', 'Delhi Technical Academy', 'Delhi College Academy', 'Delhi Institute Academy',
  'Delhi University Academy', 'Delhi Grammar Academy', 'Delhi Public Academy', 'St. Xavier\'s Academy',
  'Kendriya Vidyalaya Academy', 'Army Public Academy', 'Navy Children Academy', 'Air Force Academy',
  'Delhi International Academy', 'Modern Academy', 'Springdales Academy', 'Loreto Convent Academy',
  'St. Mary\'s Academy', 'Sacred Heart Academy', 'St. Joseph\'s Academy', 'St. Anthony\'s Academy',
  'St. Francis Academy', 'St. Paul\'s Academy', 'St. Thomas Academy', 'St. John\'s Academy',
  'St. Mark\'s Academy', 'St. Luke\'s Academy', 'St. Matthew\'s Academy', 'St. Peter\'s Academy',
  'St. Andrew\'s Academy', 'St. James Academy', 'St. Patrick\'s Academy', 'St. Michael\'s Academy',
  'St. Gabriel\'s Academy', 'St. Raphael\'s Academy', 'St. Uriel\'s Academy', 'St. Gabriel Academy',
  'St. Raphael Academy', 'St. Uriel Academy', 'Delhi Grammar Academy', 'Delhi College Academy',
  'Delhi Institute Academy', 'Delhi University Academy', 'Delhi Technical Academy', 'Delhi Science Academy',
  'Delhi Arts Academy', 'Delhi Commerce Academy', 'Delhi Medical Academy', 'Delhi Engineering Academy',
  'Delhi Law Academy', 'Delhi Business Academy', 'Delhi Management Academy', 'Delhi Computer Academy',
  'Delhi IT Academy', 'Delhi Digital Academy', 'Delhi Smart Academy', 'Delhi Future Academy',
  'Delhi Global Academy', 'Delhi World Academy', 'Delhi International College', 'Delhi Global College',
  'Delhi World College', 'Delhi Future College', 'Delhi Smart College', 'Delhi Digital College',
  'Delhi IT College', 'Delhi Computer College', 'Delhi Management College', 'Delhi Business College',
  'Delhi Law College', 'Delhi Engineering College', 'Delhi Medical College', 'Delhi Arts College',
  'Delhi Commerce College', 'Delhi Science College', 'Delhi Technical College', 'Delhi Grammar College',
  'Delhi Public College', 'St. Xavier\'s College', 'Kendriya Vidyalaya College', 'Army Public College',
  'Navy Children College', 'Air Force College', 'Delhi International College', 'Modern College',
  'Springdales College', 'Loreto Convent College', 'St. Mary\'s College', 'Sacred Heart College',
  'St. Joseph\'s College', 'St. Anthony\'s College', 'St. Francis College', 'St. Paul\'s College',
  'St. Thomas College', 'St. John\'s College', 'St. Mark\'s College', 'St. Luke\'s College',
  'St. Matthew\'s College', 'St. Peter\'s College', 'St. Andrew\'s College', 'St. James College',
  'St. Patrick\'s College', 'St. Michael\'s College', 'St. Gabriel\'s College', 'St. Raphael\'s College',
  'St. Uriel\'s College', 'St. Gabriel College', 'St. Raphael College', 'St. Uriel College',
  'Delhi Grammar College', 'Delhi Academy College', 'Delhi Institute College', 'Delhi University College',
  'Delhi Technical College', 'Delhi Science College', 'Delhi Arts College', 'Delhi Commerce College',
  'Delhi Medical College', 'Delhi Engineering College', 'Delhi Law College', 'Delhi Business College',
  'Delhi Management College', 'Delhi Computer College', 'Delhi IT College', 'Delhi Digital College',
  'Delhi Smart College', 'Delhi Future College', 'Delhi Global College', 'Delhi World College',
  'Delhi International Institute', 'Delhi Global Institute', 'Delhi World Institute', 'Delhi Future Institute',
  'Delhi Smart Institute', 'Delhi Digital Institute', 'Delhi IT Institute', 'Delhi Computer Institute',
  'Delhi Management Institute', 'Delhi Business Institute', 'Delhi Law Institute', 'Delhi Engineering Institute',
  'Delhi Medical Institute', 'Delhi Arts Institute', 'Delhi Commerce Institute', 'Delhi Science Institute',
  'Delhi Technical Institute', 'Delhi Grammar Institute', 'Delhi Public Institute', 'St. Xavier\'s Institute',
  'Kendriya Vidyalaya Institute', 'Army Public Institute', 'Navy Children Institute', 'Air Force Institute',
  'Delhi International Institute', 'Modern Institute', 'Springdales Institute', 'Loreto Convent Institute',
  'St. Mary\'s Institute', 'Sacred Heart Institute', 'St. Joseph\'s Institute', 'St. Anthony\'s Institute',
  'St. Francis Institute', 'St. Paul\'s Institute', 'St. Thomas Institute', 'St. John\'s Institute',
  'St. Mark\'s Institute', 'St. Luke\'s Institute', 'St. Matthew\'s Institute', 'St. Peter\'s Institute',
  'St. Andrew\'s Institute', 'St. James Institute', 'St. Patrick\'s Institute', 'St. Michael\'s Institute',
  'St. Gabriel\'s Institute', 'St. Raphael\'s Institute', 'St. Uriel\'s Institute', 'St. Gabriel Institute',
  'St. Raphael Institute', 'St. Uriel Institute', 'Delhi Grammar Institute', 'Delhi Academy Institute',
  'Delhi College Institute', 'Delhi University Institute', 'Delhi Technical Institute', 'Delhi Science Institute',
  'Delhi Arts Institute', 'Delhi Commerce Institute', 'Delhi Medical Institute', 'Delhi Engineering Institute',
  'Delhi Law Institute', 'Delhi Business Institute', 'Delhi Management Institute', 'Delhi Computer Institute',
  'Delhi IT Institute', 'Delhi Digital Institute', 'Delhi Smart Institute', 'Delhi Future Institute',
  'Delhi Global Institute', 'Delhi World Institute', 'Delhi International University', 'Delhi Global University',
  'Delhi World University', 'Delhi Future University', 'Delhi Smart University', 'Delhi Digital University',
  'Delhi IT University', 'Delhi Computer University', 'Delhi Management University', 'Delhi Business University',
  'Delhi Law University', 'Delhi Engineering University', 'Delhi Medical University', 'Delhi Arts University',
  'Delhi Commerce University', 'Delhi Science University', 'Delhi Technical University', 'Delhi Grammar University',
  'Delhi Public University', 'St. Xavier\'s University', 'Kendriya Vidyalaya University', 'Army Public University',
  'Navy Children University', 'Air Force University', 'Delhi International University', 'Modern University',
  'Springdales University', 'Loreto Convent University', 'St. Mary\'s University', 'Sacred Heart University',
  'St. Joseph\'s University', 'St. Anthony\'s University', 'St. Francis University', 'St. Paul\'s University',
  'St. Thomas University', 'St. John\'s University', 'St. Mark\'s University', 'St. Luke\'s University',
  'St. Matthew\'s University', 'St. Peter\'s University', 'St. Andrew\'s University', 'St. James University',
  'St. Patrick\'s University', 'St. Michael\'s University', 'St. Gabriel\'s University', 'St. Raphael\'s University',
  'St. Uriel\'s University', 'St. Gabriel University', 'St. Raphael University', 'St. Uriel University',
  'Delhi Grammar University', 'Delhi Academy University', 'Delhi College University', 'Delhi Institute University',
  'Delhi Technical University', 'Delhi Science University', 'Delhi Arts University', 'Delhi Commerce University',
  'Delhi Medical University', 'Delhi Engineering University', 'Delhi Law University', 'Delhi Business University',
  'Delhi Management University', 'Delhi Computer University', 'Delhi IT University', 'Delhi Digital University',
  'Delhi Smart University', 'Delhi Future University', 'Delhi Global University', 'Delhi World University'
];

// Indian cities
const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
  'Kota', 'Guwahati', 'Chandigarh', 'Mysore', 'Bhubaneswar', 'Amritsar', 'Prayagraj',
  'Vellore', 'Rajahmundry', 'Bhilai', 'Tiruchirappalli', 'Bharatpur', 'Panipat',
  'Durgapur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai Nagar', 'Cuttack',
  'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durg', 'Asansol',
  'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
  'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj',
  'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
  'Jalgaon', 'Udaipur', 'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Akbarpur',
  'Gulbarga', 'Lakhimpur', 'Sitapur', 'Chirala', 'Anantapur', 'Etawah', 'Raichur',
  'Ongole', 'Bharuch', 'Hapur', 'Muzaffarnagar', 'Mathura', 'Kollam', 'Avadi',
  'Kadapa', 'Kamarhati', 'Sambalpur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur',
  'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti',
  'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Hisar', 'Ozhukarai', 'Bihar Sharif',
  'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Tirupati',
  'Karnal', 'Bathinda', 'Rampur', 'Shahjahanpur', 'Haldia', 'Bhimavaram', 'Mangalore',
  'Pune', 'Nashik', 'Nagpur', 'Vadodara', 'Ludhiana', 'Agra', 'Varanasi', 'Srinagar'
];

// Indian states
const states = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Uttar Pradesh',
  'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Andhra Pradesh', 'Bihar', 'Odisha', 'Punjab',
  'Haryana', 'Jharkhand', 'Assam', 'Chhattisgarh', 'Kerala', 'Uttarakhand', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Goa', 'Tripura', 'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Mizoram',
  'Sikkim', 'Meghalaya', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep',
  'Andaman and Nicobar Islands', 'Puducherry', 'Ladakh'
];

// Generate random phone number
function generatePhoneNumber() {
  const prefixes = ['+91', '91', '0'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const firstDigit = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, or 9
  const remainingDigits = Math.floor(Math.random() * 900000000) + 100000000; // 9 digits
  return `${prefix}${firstDigit}${remainingDigits}`;
}

// Generate random email
function generateEmail(schoolName) {
  const cleanName = schoolName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'school.edu.in', 'academy.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanName}${randomNum}@${domain}`;
}

// Generate random address
function generateAddress(city, state) {
  const streetTypes = ['Street', 'Road', 'Avenue', 'Lane', 'Colony', 'Nagar', 'Vihar', 'Enclave'];
  const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
  const streetNumber = Math.floor(Math.random() * 999) + 1;
  const areaNames = ['Central', 'North', 'South', 'East', 'West', 'New', 'Old', 'Upper', 'Lower'];
  const areaName = areaNames[Math.floor(Math.random() * areaNames.length)];
  
  return `${streetNumber} ${areaName} ${city} ${streetType}, ${city}, ${state}`;
}

// Get random image from schools folder
async function getRandomImage() {
  try {
    const schoolsDir = join(process.cwd(), 'public', 'schools');
    const files = await readdir(schoolsDir);
    const imageFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );
    
    if (imageFiles.length === 0) {
      return '/schoolImages/default-school.jpg';
    }
    
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    return `/schools/${randomImage}`;
  } catch (error) {
    console.error('Error reading schools directory:', error);
    return '/schoolImages/default-school.jpg';
  }
}

// Generate fake school data
function generateFakeSchool() {
  const name = schoolNames[Math.floor(Math.random() * schoolNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  
  return {
    name: `${name} - ${city}`,
    address: generateAddress(city, state),
    city: city,
    state: state,
    contact: generatePhoneNumber(),
    email_id: generateEmail(name),
    image: '', // Will be set later
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
  };
}

// Main function to generate schools
async function generateFakeSchools(count = 250) {
  try {
    console.log(`Starting to generate ${count} fake schools...`);
    
    const schools = [];
    
    for (let i = 0; i < count; i++) {
      const school = generateFakeSchool();
      school.image = await getRandomImage();
      schools.push(school);
      
      if ((i + 1) % 50 === 0) {
        console.log(`Generated ${i + 1} schools...`);
      }
    }
    
    console.log('Inserting schools into database...');
    
    // Insert schools in batches to avoid overwhelming the database
    const batchSize = 25;
    for (let i = 0; i < schools.length; i += batchSize) {
      const batch = schools.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(school => 
          prisma.school.create({
            data: school
          })
        )
      );
      
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(schools.length / batchSize)}`);
    }
    
    console.log(`✅ Successfully generated and inserted ${count} fake schools!`);
    
  } catch (error) {
    console.error('❌ Error generating fake schools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateFakeSchools(250); 