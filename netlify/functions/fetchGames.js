const fetch = require("node-fetch");
require("dotenv").config();

exports.handler = async (event, context) => {
  try {
    const query = event.queryStringParameters.query;
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      console.error("RAWG_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key is missing" }),
      };
    }

    if (!query) {
      console.error("Query parameter is missing");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Query parameter is required" }),
      };
    }

    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Error fetching data from RAWG API:",
        response.status,
        errorText
      );
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Error fetching data from RAWG API",
          details: errorText,
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server Error", details: error.message }),
    };
  }
};
