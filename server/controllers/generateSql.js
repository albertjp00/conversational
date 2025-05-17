
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
    console.log("🛠️ Calling OpenAI to generate SQL...");

    const prompt = `
    

    The database has a messy schema and sometimes missing or unclear column names.

    use postgreSQl queries to get the output

    if a table doesn't exist tell not data not available 

You are a data analyst. Use the schema below and user question to write an accurate SQL query.
if  the schema is not helpful create a query in suitable with the question for the  output

Schema:
${schemaDescription}

Question:
${question}

Return SQL only, no explanations.
`;

const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`
  
  
  ,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
          }
        );
    
        console.log("responseeee",response.data);
        
        const sqlObj = response.data.candidates[0].content;
        const rawSQL = sqlObj.parts[0].text;

        const cleanedSQL = rawSQL.replace(/```sql|```/g, '').trim();

        // console.log("✅ Generated SQL:", cleanedSQL);
        return cleanedSQL;

  } catch (error) {
    console.error("❌ Error generating SQL:", error.response?.data || error.message);
    throw error;
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
