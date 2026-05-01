import { useState } from "react";
import { useParams } from "react-router-dom";
import { GapsSidebar } from "../components/GapsSidebar";
import { ReportNavSidebar } from "../components/ReportNavSidebar";
import { TechnicalQuestionsPanel } from "../components/TechnicalQuestionsPanel";
import { BehavioralQuestionsPanel } from "../components/BehavioralQuestionsPanel";
import { RoadMapPanel } from "../components/RoadMapPanel";

// ─── Mock data for UI demonstration ──────────────────────────────
// TODO: Replace with real data from useInterviewReport(reportId) hook
const MOCK_GAPS = [
  { id: 1, title: "Cloud Architecture", severity: "high" },
  { id: 2, title: "System Design", severity: "high" },
  { id: 3, title: "CI/CD Pipelines", severity: "medium" },
  { id: 4, title: "Database Optimization", severity: "medium" },
  { id: 5, title: "Team Leadership", severity: "low" },
  { id: 6, title: "Agile Methodologies", severity: "low" },
];

const MOCK_TECHNICAL = [
  { id: "t1", question: "Explain the differences between microservices and monolithic architecture. When would you choose one over the other?", interviewerIntention: "Assessing your understanding of architectural trade-offs and ability to make pragmatic decisions based on team size, complexity, and scaling needs.", sampleAnswer: "Microservices decompose an application into small, independently deployable services. Monoliths bundle everything into a single deployment unit. Choose microservices for independent scaling and diverse stacks; monoliths for smaller teams and simpler domains.", difficulty: "Medium" },
  { id: "t2", question: "How would you design a distributed caching system to handle millions of requests per second?", interviewerIntention: "Evaluating your system design skills at scale — specifically knowledge of caching layers, consistency strategies, and failure handling under high throughput.", sampleAnswer: "Use a layered approach: in-process L1 cache backed by distributed L2 cache (Redis Cluster) with consistent hashing. Cache invalidation via pub/sub. TTL-based expiration with jitter to prevent thundering herds.", difficulty: "Hard" },
  { id: "t3", question: "What are the key principles of RESTful API design?", interviewerIntention: "Testing foundational knowledge of web standards and whether you can design clean, maintainable APIs that other teams can consume easily.", sampleAnswer: "Resource-oriented URIs, proper HTTP methods, appropriate status codes, pagination, statelessness, HATEOAS, and versioning for evolving APIs.", difficulty: "Easy" },
  { id: "t4", question: "Describe how you would implement rate limiting in a distributed system.", interviewerIntention: "Probing your knowledge of protecting services from abuse and understanding of distributed state management with tools like Redis.", sampleAnswer: "Token bucket or sliding window algorithm using Redis. Each request atomically checks and decrements a counter. Local + global hybrid for low latency.", difficulty: "Medium" },
  { id: "t5", question: "Explain the CAP theorem and how it influences database selection.", interviewerIntention: "Gauging your theoretical understanding of distributed systems and whether you can translate theory into practical database selection decisions.", sampleAnswer: "CAP: a distributed system guarantees at most two of Consistency, Availability, Partition Tolerance. CP for financial systems (PostgreSQL), AP for social feeds (Cassandra).", difficulty: "Hard" },
];

const MOCK_BEHAVIORAL = [
  { id: "b1", question: "Tell me about a time you had to lead a team through a challenging project with a tight deadline.", interviewerIntention: "Assessing leadership under pressure — can you prioritize, delegate, and keep a team aligned when stakes are high?", sampleAnswer: "Migrated a legacy system in 6 weeks by breaking into parallel workstreams, daily standups, and handling the riskiest integration layer personally.", category: "Leadership" },
  { id: "b2", question: "Describe a situation where you disagreed with a colleague's technical approach.", interviewerIntention: "Evaluating conflict resolution skills and whether you use data-driven arguments rather than ego-driven confrontation.", sampleAnswer: "Created a proof-of-concept comparing NoSQL vs relational for our use case. Benchmarks showed relational was 10x faster, turning conflict into collaboration.", category: "Communication" },
  { id: "b3", question: "Give an example of when you had to quickly adapt to a significant change in project requirements.", interviewerIntention: "Testing your flexibility and composure when plans change — do you freeze or re-strategize quickly?", sampleAnswer: "Client pivoted from B2B to B2C mid-sprint. Re-scoped immediately, identified reusable components, delivered core flow on time.", category: "Adaptability" },
  { id: "b4", question: "Tell me about a complex problem you solved that others couldn't figure out.", interviewerIntention: "Looking for analytical depth and persistence — can you systematically debug issues that others have given up on?", sampleAnswer: "Found intermittent memory leak by systematically profiling heap dumps. A closure retained large request objects. One-line fix after methodical investigation.", category: "Problem Solving" },
];

const MOCK_ROADMAP = [
  { id: "r1", title: "Review Core System Design Patterns", description: "Study microservices, event-driven architecture, and distributed systems fundamentals.", duration: "3 days", status: "completed" },
  { id: "r2", title: "Practice Technical Coding Problems", description: "Complete 15-20 medium/hard problems on data structures and algorithms.", duration: "5 days", status: "completed" },
  { id: "r3", title: "Deep Dive into Cloud Architecture", description: "Study AWS/GCP core services, IAM, networking, and serverless patterns.", duration: "4 days", status: "current" },
  { id: "r4", title: "Behavioral Interview Preparation", description: "Prepare 8-10 STAR stories covering leadership, conflict resolution, and teamwork.", duration: "2 days", status: "upcoming" },
  { id: "r5", title: "Mock Interviews & Final Review", description: "Conduct 2-3 mock interviews simulating real conditions.", duration: "3 days", status: "upcoming" },
];

const MOCK_MATCH_SCORE = 78;

const TAB_PANELS = { technical: TechnicalQuestionsPanel, behavioral: BehavioralQuestionsPanel, roadmap: RoadMapPanel };
const TAB_DATA = { technical: { questions: MOCK_TECHNICAL }, behavioral: { questions: MOCK_BEHAVIORAL }, roadmap: { steps: MOCK_ROADMAP } };

export function InterviewReportPage() {
  const { reportId } = useParams();
  const [activeTab, setActiveTab] = useState("technical");

  // TODO: Use reportId to fetch real data via useInterviewReport(reportId)

  const ActivePanel = TAB_PANELS[activeTab];
  const panelProps = TAB_DATA[activeTab];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar: Navigation */}
      <ReportNavSidebar activeTab={activeTab} onTabChange={setActiveTab} matchScore={MOCK_MATCH_SCORE} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/90 backdrop-blur-sm px-6 py-3.5">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 transition-transform group-hover:scale-105">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900">TalentSync</span>
            </a>
            <span className="text-zinc-300">/</span>
            <span className="text-sm font-medium text-zinc-500">Interview Report</span>
            {reportId && (
              <>
                <span className="text-zinc-300">/</span>
                <span className="text-xs font-mono text-zinc-400">{reportId.slice(0, 8)}…</span>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 outline-none focus:border-zinc-400">
              <option value="technical">Technical Questions</option>
              <option value="behavioral">Behavioral Questions</option>
              <option value="roadmap">Road Map</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-8 max-w-3xl">
          <ActivePanel {...panelProps} />
        </div>
      </main>

      {/* Right Sidebar: Gaps */}
      <GapsSidebar gaps={MOCK_GAPS} />
    </div>
  );
}
