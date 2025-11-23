require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        console.log("Listing models...");
        // There is no direct listModels method on genAI instance in some versions, 
        // but let's try to use the model to generate content to see if we can get a better error 
        // or if there is a way to list.
        // Actually, the error message suggested: "Call ListModels to see the list of available models"
        // This usually implies using the REST API or a specific method.
        // In the Node SDK, it might be different.

        // Let's try a known valid model for free tier if applicable: gemini-pro
        // If that failed, maybe the API key is for Vertex AI? No, it looks like AI Studio key.

        // Let's try to use the fetch directly to list models if SDK doesn't expose it easily.
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available Models:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

main();
