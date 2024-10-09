/* eslint-disable no-undef */
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      console.error("RAWG_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key is missing" }),
      };
    }

    const queryParameters = event.queryStringParameters || {};
    const queryParams = [];

    for (const [key, value] of Object.entries(queryParameters)) {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }

    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&${queryParams.join(
      "&"
    )}`;

    console.log("Fetching data from RAWG API:", apiUrl);

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
