Vaani-Nyay: Voice-Powered Legal Aid and Case Tracking

Vaani-Nyay is an AI-powered, voice-friendly legal aid and case tracking system designed for rural and non-digital users, enabling them to file, track, and manage legal cases seamlessly.

Features

- Voice-to-text legal form filling using  ASR
- Real-time text translation using  NMT
- Text-to-speech for guidance using  TTS
- User registration and login
- Case filing with voice and text input
- Track case status and progress
- View detailed case timelines, remarks, and documents
- Accessible, clean, mobile-friendly user interface
- MongoDB backend with Express.js


Tech Stack

Frontend: React.js, Tailwind CSS  
Backend: Node.js, Express.js  
Database: MongoDB  
API Testing: Postman / Thunder Client  
Version Control: Git, GitHub


Local Setup

1. Clone the repository:

git clone https://github.com/yourusername/vaani-nyay.git
cd vaani-nyay

2. Backend setup:

cd backend
npm install

Create a .env file with the following:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/vaani-nyay
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

Run the backend:

npm start

3. Frontend setup:

Open a new terminal:

cd frontend
npm install
npm start

The frontend will run on http://localhost:3000


API Endpoints

GET /api/health - Check backend health  
POST /api/auth/register - User registration  
POST /api/auth/login - User login  
POST /api/cases - Create a new case  
GET /api/cases - Retrieve all cases (optional search)  
GET /api/cases/:id - Get case details by ID  
PUT /api/cases/:id - Update case by ID  
DELETE /api/cases/:id - Delete case by ID


Contact

For queries, collaborations, or contributions:

GitHub: https://github.com/Anuragkhanna24
Email: anuragshivkhanna@gmail.com


Built to simplify legal aid access for Bharat.
