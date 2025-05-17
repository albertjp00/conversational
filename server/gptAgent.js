    const axios = require('axios')
    require('dotenv').config()

    
    



async function generateSQL(question, schemaDescription) {
    console.log("here");
    
  const prompt = `
You are a data analyst. Use the schema below and user question to write an accurate SQL query.

Schema:
${schemaDescription}

Question:
${question}


Return SQL only, no explanations.
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );

  const sql = response.data.choices[0].message.content.trim();
  return sql;
}

module.exports = generateSQL;
