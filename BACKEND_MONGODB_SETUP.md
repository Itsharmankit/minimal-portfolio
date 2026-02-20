# Backend & Database Configuration

## Overview
- **Frontend**: Deployed on Vercel (static site)
- **Backend API**: Deployed on Render.com
- **Database**: MongoDB (Atlas recommended)
- **Form Endpoint**: `https://portfolio-backend-wt5.onrender.com/contact`

---

## Backend Setup (Render.com)

### Prerequisites
1. Render account: https://render.com/
2. GitHub repository with your backend code
3. MongoDB connection string (see Database section below)

### Deployment Steps

1. **Create New Web Service on Render**:
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Choose the repo with your backend code

2. **Configure Service**:
   - **Name**: `portfolio-backend`
   - **Region**: Choose closest to your location
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Add Environment Variables**:
   - Click "Environment" tab
   - Add these variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=3000
     NODE_ENV=production
     CORS_ORIGIN=https://yourdomain.vercel.app
     EMAIL_SERVICE=gmail  (if using email)
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASSWORD=your_app_password
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your Render URL (e.g., `https://portfolio-backend-wt5.onrender.com`)

---

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Sign up (free tier available)
- Create a new project

### 2. Create a Cluster
- Click "Create Deployment"
- Choose **M0 Sandbox** (free tier)
- Select your region
- Create cluster

### 3. Create Database User
- Go to "Database Access"
- Create new database user
- Username: `portfolio_user`
- Password: Generate strong password (save it!)
- Add user

### 4. Allow Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
- For production: Add only your Render server IP

### 5. Get Connection String
- Click "Databases" > "Connect"
- Choose "Drivers" (Node.js)
- Copy connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`
- Replace `<username>` and `<password>` with your database user credentials
- Add this to Render environment variables as `MONGODB_URI`

---

## Backend Code Example (Node.js + Express + MongoDB)

Create your backend repository with this structure:

```
backend/
├── server.js
├── package.json
└── routes/
    └── contact.js
```

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Contact Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  subject: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Contact Route
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to MongoDB
    const newMessage = new Message({
      name,
      email,
      message,
      subject
    });

    await newMessage.save();

    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### package.json
```json
{
  "name": "portfolio-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## Testing the Connection

### 1. Test Render Backend Health
```bash
curl https://portfolio-backend-wt5.onrender.com/health
```
Expected response: `{"status":"ok"}`

### 2. Test Form Submission
```bash
curl -X POST https://portfolio-backend-wt5.onrender.com/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Test message","subject":"Test"}'
```

### 3. Check MongoDB Data
- Go to MongoDB Atlas Dashboard
- Click "Browse Collections"
- You should see your messages collection with entries

---

## Frontend Configuration

Your frontend (Vercel) is already configured to send data to the backend:

**Location**: `script.js` (line 45)
```javascript
const response = await fetch(
  "https://portfolio-backend-wt5.onrender.com/contact",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
);
```

---

## Troubleshooting

### CORS Issues
If you see "blocked by CORS" error:
- Add your Vercel domain to backend's CORS config
- Example: `CORS_ORIGIN=https://yourportfolio.vercel.app`

### MongoDB Connection Failed
- Check connection string in environment variables
- Verify database user credentials
- Ensure IP is whitelisted in MongoDB Atlas

### Form Submissions Not Working
- Check browser console for errors
- Verify backend URL is correct
- Test backend health endpoint
- Check MongoDB is connected

### Render Server Keeps Restarting
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string
- Ensure PORT is set to 3000

---

## Security Best Practices

1. **Never expose MongoDB credentials** in frontend code
2. **Use environment variables** for all secrets
3. **Enable HTTPS** everywhere (automatic on Vercel & Render)
4. **Validate all form inputs** on backend
5. **Add rate limiting** to prevent spam
6. **Sanitize user input** to prevent injection attacks
7. **Use strong passwords** for MongoDB database users
8. **Keep dependencies updated** regularly

---

## Verification Checklist

- [ ] Vercel deployment live at your domain
- [ ] Render backend deployed and responding
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Environment variables configured on Render
- [ ] CORS enabled on backend for your Vercel domain
- [ ] Form submission works end-to-end
- [ ] Messages appear in MongoDB collection
- [ ] Health check endpoint returns OK
- [ ] No console errors in browser DevTools
- [ ] No errors in Render logs
