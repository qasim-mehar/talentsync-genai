const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_API_Key,
});


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description:
        "Match score from 0 to 100 representing how well the candidate's resume matches the job description.",
    },
    technicalQuestions: {
      type: Type.ARRAY,
      description:
        "5-8 technical questions an interviewer would ask based on the job description.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The technical interview question.",
          },
          intention: {
            type: Type.STRING,
            description:
              "Why the interviewer is asking this question — what skill or knowledge it evaluates.",
          },
          answer: {
            type: Type.STRING,
            description:
              "A detailed model answer including thought process, steps, and approach.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      description:
        "3-5 behavioral questions an interviewer would ask based on the job description.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The behavioral interview question.",
          },
          intention: {
            type: Type.STRING,
            description:
              "Why the interviewer is asking this — what trait or soft skill it evaluates.",
          },
          answer: {
            type: Type.STRING,
            description:
              "How to answer effectively — key points to highlight and recommended approach.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: Type.ARRAY,
      description:
        "Skill gaps the candidate has based on comparing their resume to the job description.",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: {
            type: Type.STRING,
            description: "The skill the candidate is lacking.",
          },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
            description:
              "low = basic knowledge present, medium = some familiarity, high = no knowledge at all.",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: Type.ARRAY,
      description:
        "A day-by-day preparation plan the candidate should follow before the interview.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.NUMBER,
            description: "The day number starting from 1.",
          },
          focus: {
            type: Type.STRING,
            description: "The main topic or area to focus on for that day.",
          },
          tasks: {
            type: Type.ARRAY,
            description: "Specific actionable tasks for that day.",
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert technical interviewer with 15 years of experience.

CANDIDATE PROFILE:
- Resume: ${resume}
- Self Description: ${selfDescription}

JOB DESCRIPTION:
${jobDescription}

TASK:
Analyze the candidate's profile against the job description and generate:

1. **matchScore**: A number 0-100 representing how well the candidate matches the role.
2. **technicalQuestions**: 5-8 technical questions you would ask this candidate. For EACH question, provide the question, your intention behind asking it, and a detailed model answer.
3. **behavioralQuestions**: 3-5 behavioral questions. For EACH, include the question, intention, and a recommended answer approach.
4. **skillGaps**: Identify specific skills the candidate is missing or weak in, with severity (low/medium/high).
5. **preparationPlan**: A day-by-day study plan (7-14 days) to help the candidate prepare, with specific tasks for each day.

Be thorough and specific. Every question MUST have all three fields: question, intention, and answer.`;

  try{const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  return JSON.parse(res.text);}catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate interview report from AI service"); 
  }
}

module.exports = { generateInterviewReport };