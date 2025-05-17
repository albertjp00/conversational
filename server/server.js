const express = require("express");
const app = express()
const cors = require("cors");
const { user } = require("./routes/route");
require("dotenv").config();

const corsOptions = {
    origin: "https://conversational-client.vercel.app",  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  
  };
  
  app.use(cors(corsOptions));
  


app.use(express.json());



app.use('/',user)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
