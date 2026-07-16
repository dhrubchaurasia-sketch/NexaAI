import "dotenv/config";

const getGeminiAPIResponse = async (message, retries = 2) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.NexaAI_API_KEY}`,
      options
    );

    const data = await response.json();

    // Agar API ne error diya (invalid key, quota, bad request, etc.)
    if (data.error?.code === 429 && retries > 0) {
      console.log("Rate limited, retrying in 5s...");
      await new Promise((r) => setTimeout(r, 5000));
      return getGeminiAPIResponse(message, retries - 1);
    }

    if (!response.ok || data.error) {
      console.log("Gemini API error:", data.error || data);
      return "Sorry, I couldn't process that request right now. Please try again.";
    }

    // Agar candidates missing hai (e.g. safety block)
    if (!data.candidates || !data.candidates[0]) {
      console.log("Unexpected Gemini response:", JSON.stringify(data));
      return "Sorry, I couldn't generate a response for that.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.log("Fetch/network error:", err);
    return "Something went wrong while contacting the AI service.";
  }
};

export default getGeminiAPIResponse;