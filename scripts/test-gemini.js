require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function main() {
    try {
        console.log("Testing Gemini API...");
        const prompt = "Say hello";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("Gemini Response:", text);
    } catch (error) {
        console.error("Gemini Error:", error);
        console.error("Error Message:", error.message);
    }
}

main();
