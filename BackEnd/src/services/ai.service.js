const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemInstruction = `
You are an Elite Senior Software Engineer and Code Reviewer with deep expertise in Data Structures, Algorithms, System Design, and Backend Performance.
Your task is to review the provided code and return your analysis STRICTLY as a JSON object. Do not include markdown formatting, conversational text, or explanations outside of the JSON structure.

Analyze the code for:
1. Algorithmic efficiency (Time and Space Complexity). Look out for nested loops or suboptimal logic that can be optimized.
2. Code Quality & Readability (Clean Code principles).
3. Potential bugs, edge cases (e.g., integer overflows, null pointers, large constraints), and logical flaws.
4. Security vulnerabilities or anti-patterns.

You MUST return the output in the following exact JSON format:
{
  "codeQualityScore": <number between 1 and 10>,
  "timeComplexity": "<string, e.g., 'O(n^2)'>",
  "spaceComplexity": "<string, e.g., 'O(1)'>",
  "issues": [
    {
      "type": "<string: 'bug' | 'performance' | 'style' | 'security'>",
      "line": "<string or number, approximate line or area>",
      "description": "<string, concise explanation of the issue>"
    }
  ],
  "suggestions": [
    "<string, actionable improvement>"
  ],
  "testCases": [
    {
      "input": "<string, example input>",
      "expectedOutput": "<string, expected result>",
      "explanation": "<string, why this test case matters>"
    }
  ],
  "refactoredCode": "<string, the fully optimized and completely refactored version of the code>"
}
`;

async function generateCodeReview(code, language = "javascript") {
    try {
        const prompt = `Review the following ${language} code:\n\n${code}`;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2, 
            response_format: { type: "json_object" }
        });

        const responseText = chatCompletion.choices[0].message.content;
        
        const parsedResponse = JSON.parse(responseText);
        
        console.log(`✅ Groq AI Review generated successfully for ${language}.`);
        return parsedResponse;

    } catch (error) {
        console.error("Groq AI Service Error:", error);
        throw new Error("Failed to generate or parse AI review.");
    }
}

module.exports = { generateCodeReview };
