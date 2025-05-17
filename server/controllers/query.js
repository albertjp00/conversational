const express = require("express");
const router = express.Router();
const db = require("../db");
const generateSQL = require("./generateSql");
const { default: axios } = require("axios");


const query = async (req, res) => {
  console.log("Query endpoint hit ✅");

  const { question } = req.body;
  console.log("Received question:", question);

  try {
    // 1. Get schema info from database
    const schemaQuery = `
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public';
    `;

    const schemaRes = await db.query(schemaQuery);
    const schema = schemaRes.rows
      .map((r) => `${r.table_name}.${r.column_name} (${r.data_type})`)
      .join("\n");

    // 2. Generate SQL from the question and schema
    const sql = await generateSQL(question, schema);
    console.log("Generated SQL:", sql);

    // 3. Execute the SQL
    let result;
    try {
      result = await db.query(sql);
    } catch (dbError) {
      console.error("DB Query Error:", dbError.message);

      // Return custom message if SQL references invalid tables/columns
      return res.json({
        sql,
        result: [],
        message: "Data not available for your question (invalid or irrelevant query).",
      });
    }

    console.log("Query result:", result.rows);

    // 4. Check if result is empty
    if (result.rows.length === 0) {
      return res.json({
        sql,
        result: [],
        message: "No data available for your question.",
      });
    }

    // 5. Respond to client
    res.json({ sql, result: result.rows });

  } catch (error) {
    console.error("Error in /api/query:", error);
    res.status(500).send("Error answering question.");
  }
};











module.exports = {
  query,
  printdata
}



// const query =  async (req, res) => {
//   console.log("Query");
  
//   const { question } = req.body;
//   console.log(question);
  

//   try {
 
//       const API_KEY = process.env.API_KEY

      
//       let customPrompt = `
//       You are a chatbot for a food delivery service called 'Tomato'.
//       Your goal is to assist customers with:
//       - Placing food orders
//       - Tracking deliveries
//       - Answering menu-related questions
//       - Providing personalized recommendations

//       users previous orders are given utilise that to recommend  

//       Keep responses friendly, short, helpful, and focused on food delivery.

//       User: ${question}
//       `
        
  
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`


// ,
//         {
//           contents: [{ role: "user", parts: [{ text: customPrompt }] }]
//         }
//       );
  
  
      
//       const replyParts = response.data.candidates?.[0]?.content?.parts;
//       const reply = replyParts ? replyParts.map(part => part.text).join(" ") : "Sorry, I couldn't understand that.";
  
//       console.log(reply);
      
//       // res.json({ reply });
//   } catch (error) {
//     console.error("Error in /api/query:", error);
//     res.status(500).send("Error answering question.");
//   }
// };

// module.exports = {
//   query
// }

