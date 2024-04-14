require('dotenv').config();
const express = require('express');
const app = express();


const PORT = process.env.PORT || 3220;
const connectDb =require("./config/db");
// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const diaryEntryRoutes = require('./routes/diaryEntryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryEntryRoutes);

// Start server

connectDb().then(()=>{
  app.listen(PORT,()=>{
      console.log(`server is running at port: ${PORT}`);
  });
});
