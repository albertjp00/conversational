
const { default: axios } = require("axios");
require('dotenv').config()

// async function generateSQL(question, schemaDescription) {
//   console.log("Query");
  

  

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


//       Schema:
// ${schemaDescription}

// Question:
// ${question}
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
//     console.log("error",error.response?.data || error.message);
//     throw error
//   }
// }

// module.exports = {
//     generateSQL
// }





async function generateSQL(question, schemaDescription) {
  try {
    console.log("🛠️ Calling Gemini to generate SQL...");

    if (!process.env.API_KEY) {
      console.error("❌ Missing API key.");
      return "Error: API key is missing. Please check your server configuration.";
    }

    const prompt = `
The database has a messy schema and sometimes missing or unclear column names.
Use PostgreSQL queries to get the output.
If a table doesn't exist, say "data not available."

You are a data analyst. Use the schema below and user question to write an accurate SQL query.
If the schema is not helpful, create a query suitable for the question output.

Schema:
${schemaDescription}

Question:
${question}

Return SQL only, no explanations.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }
    );

    if (
      !response.data?.candidates ||
      !response.data.candidates[0]?.content?.parts[0]?.text
    ) {
      console.error("❌ Invalid response from Gemini API");
      return "Error: Failed to generate SQL. Invalid response from Gemini API.";
    }

    const rawSQL = response.data.candidates[0].content.parts[0].text;
    const cleanedSQL = rawSQL.replace(/```sql|```/g, '').trim();

    return cleanedSQL;

  } catch (error) {
    console.error("❌ Error generating SQL:", error.response?.data || error.message);
    return `Error: ${error.response?.data?.error?.message || error.message || "Unknown error occurred."}`;
  }
}




module.exports =  generateSQL



//chatgpt 
    // const response = await axios.post(
    //   "https://api.openai.com/v1/chat/completions",
    //   {
    //     model: "gpt-4",
    //     messages: [{ role: "user", content: prompt }],
    //     temperature: 0.2, // optional: keeps responses more consistent
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.API_KEY}`,
    //       "Content-Type": "application/json"
    //     },
    //   }
    // );
