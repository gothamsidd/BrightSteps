const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env" });

const MODEL_NAME = "gemini-2.5-flash-lite";

async function verifyAllFeatures() {
    console.log("🚀 Starting Comprehensive AI Feature Verification...");
    console.log(`Using Model: ${MODEL_NAME}`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY is missing");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 1. Test Dashboard Insights
    console.log("\n1️⃣  Testing Dashboard Insights (JSON Mode)...");
    try {
        const prompt = `
      Analyze the current state of the Tech industry and provide insights in ONLY the following JSON format:
      {
        "salaryRanges": [{ "role": "string", "min": 1, "max": 2, "median": 1.5, "location": "string" }],
        "growthRate": 5.5,
        "demandLevel": "High",
        "topSkills": ["skill1"],
        "marketOutlook": "Positive",
        "keyTrends": ["trend1"],
        "recommendedSkills": ["skill1"]
      }
      IMPORTANT: Return ONLY the JSON.
    `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
        JSON.parse(cleaned); // Verify JSON parsing
        console.log("✅ Dashboard Insights: Success");
    } catch (e) {
        console.error("❌ Dashboard Insights Failed:", e.message);
    }

    // 2. Test Interview Quiz
    console.log("\n2️⃣  Testing Interview Quiz (JSON Mode)...");
    try {
        const prompt = `
      Generate 1 technical interview question for a React developer.
      Return in this JSON format only:
      {
        "questions": [{ "question": "q", "options": ["a","b","c","d"], "correctAnswer": "a", "explanation": "e" }]
      }
    `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
        JSON.parse(cleaned); // Verify JSON parsing
        console.log("✅ Interview Quiz: Success");
    } catch (e) {
        console.error("❌ Interview Quiz Failed:", e.message);
    }

    // 3. Test Resume Improvement
    console.log("\n3️⃣  Testing Resume Improvement (Text Mode)...");
    try {
        const prompt = `
      Improve this resume bullet point: "Built a website using React."
      Make it impactful.
    `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text.length > 10) console.log("✅ Resume Improvement: Success");
        else throw new Error("Response too short");
    } catch (e) {
        console.error("❌ Resume Improvement Failed:", e.message);
    }

    // 4. Test Cover Letter
    console.log("\n4️⃣  Testing Cover Letter (Text Mode)...");
    try {
        const prompt = `
      Write a short cover letter for a Software Engineer role at Google.
      Keep it under 100 words.
    `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text.length > 50) console.log("✅ Cover Letter: Success");
        else throw new Error("Response too short");
    } catch (e) {
        console.error("❌ Cover Letter Failed:", e.message);
    }

    console.log("\n✨ Verification Complete!");
}

verifyAllFeatures();
