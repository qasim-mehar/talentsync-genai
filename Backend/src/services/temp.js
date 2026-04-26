const jobDescription = `
We are looking for a Full-Stack GenAI Engineer to join our product team at TalentSync.
You will design and build AI-powered features end-to-end — from React frontends to 
Node.js/Express backends — integrating large language models (Gemini) into 
production workflows. Responsibilities include architecting RESTful APIs, designing 
MongoDB schemas, building prompt pipelines with structured output, implementing 
authentication/authorization (JWT, OAuth), and deploying on cloud platforms (GCP/AWS).

Requirements:
- 2+ years of hands-on experience with the MERN stack (MongoDB, Express, React, Node.js)
- Experience integrating LLM APIs (Google Gemini, OpenAI) with structured JSON output
- Strong understanding of prompt engineering and AI agent patterns
- Proficiency in Mongoose ODM, Zod validation, and REST API design
- Familiarity with Git, CI/CD pipelines, and agile workflows
- Bonus: experience with Next.js, TailwindCSS, or Python-based ML tooling
`;

const resume = `
Qasim Ali — Full-Stack GenAI Developer

Education:
- BS Computer Science (in progress)

Technical Skills:
- Frontend: React.js, Next.js, TailwindCSS, Shadcn UI, HTML/CSS/JS
- Backend: Node.js, Express.js, REST APIs, JWT Authentication
- Database: MongoDB, Mongoose ODM
- AI/ML: Google Gemini API, prompt engineering, structured output with Zod schemas
- Tools: Git, GitHub, VS Code, Postman, Nodemon, npm

Projects:
1. TalentSync (GenAI Resume Evaluator)
   - Built a full-stack app that uses Gemini AI to generate interview prep reports
   - Designed Mongoose models with production-grade validation, indexes, and pagination
   - Implemented secure auth with JWT, bcrypt, and token blacklisting
   - Created Zod-validated structured AI output for interview questions and skill gaps

2. Authentication System
   - Developed login/register flow with protected routes using React Context
   - Integrated CORS, cookie-based sessions, and error boundary handling

3. Flutter Mobile App
   - Built a cross-platform login flow using DummyJSON API with SharedPreferences token storage
`;

const selfDescription = `
I'm Qasim Ali, a MERN stack developer with a strong focus on Generative AI integration. 
I've been building full-stack web applications and recently shifted my focus toward 
AI-powered products. I have hands-on experience integrating Google Gemini into Node.js 
backends with structured JSON output using Zod schemas. I'm comfortable designing 
MongoDB schemas, writing Express APIs, and building React frontends. I'm a fast learner 
who enjoys solving complex problems and shipping production-quality code. I'm looking to 
grow into a role where I can combine my full-stack skills with cutting-edge AI capabilities.
`;

module.exports = { resume, selfDescription, jobDescription };