import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Braces, CodeXml, FlaskConical, GitBranch, GraduationCap, ScanLine, Terminal } from "lucide-react";
import { Brand } from "@/components/header";
import { TracePanel } from "@/components/trace-panel";

const features = [
  { title: "Predict the next move", description: "Make a call before you step the algorithm. See exactly where your reasoning holds up.", icon: ScanLine, href: "/learn/binary-search", label: "Try a lesson", color: "purple" },
  { title: "See the state change", description: "Change the input, step backward, and follow the variables and pseudocode together.", icon: FlaskConical, href: "/lab", label: "Open the lab", color: "cyan" },
  { title: "Apply it in code", description: "Carry the same idea into an original challenge, with progressive hints if you get stuck.", icon: Terminal, href: "/practice", label: "Solve a problem", color: "green" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span/> INTERACTIVE ALGORITHM LEARNING</div>
            <h1>Learn to think<br/><em>in algorithms.</em></h1>
            <p>Predict the next step, see the algorithm in action, then write the solution yourself. From your first loop to your first contest.</p>
            <div className="hero-actions">
              <Link className="button primary" href="/start">Start learning <ArrowRight size={18} aria-hidden="true"/></Link>
              <Link className="button secondary" href="/lab"><FlaskConical size={18} aria-hidden="true"/> Try the Visual Lab</Link>
            </div>
            <div className="hero-languages" aria-label="Supported languages"><span>CHOOSE YOUR LANGUAGE</span><Link href="/start?language=c"><Braces size={15} aria-hidden="true"/> C</Link><Link href="/start?language=python"><CodeXml size={15} aria-hidden="true"/> Python</Link><Link href="/start?language=java"><Terminal size={15} aria-hidden="true"/> Java</Link></div>
          </div>
          <div className="hero-demo"><TracePanel preview /></div>
        </div>
        <div className="shell hero-foot"><a href="#learning-loop"><ArrowDown size={15} aria-hidden="true"/> Explore the learning loop</a><span>LEARN. THINK. CODE. COMPETE. MASTER.</span></div>
      </section>
      <section className="shell loop-section" id="learning-loop">
        <div className="section-marker eyebrow"><span/> THE LEARNING LOOP</div>
        <div className="section-head"><h2>Understand it.<br/>Then make it work.</h2><p>A lesson, a live trace, and a coding challenge use the same idea so you can carry what you learn into an unfamiliar problem.</p></div>
        <div className="feature-grid">
          {features.map(({title, description, icon: Icon, href, label, color}) => <article className="feature" key={title}><div className={`feature-icon ${color}`}><Icon size={24} aria-hidden="true"/></div><h3>{title}</h3><p>{description}</p><Link href={href}>{label} <ArrowUpRight size={16} aria-hidden="true"/></Link></article>)}
        </div>
      </section>
      <section className="paths-band"><div className="shell paths-grid">
        <div><div className="section-marker eyebrow"><span/> LEARNING PATHS</div><h2>Find your starting point.</h2><p>Explore the roadmap and choose a route for fundamentals, interviews, or contest practice.</p></div>
        <div className="path-links">
          <Link href="/start?goal=fundamentals"><GraduationCap size={20}/> Programming fundamentals <ArrowRight size={18}/></Link>
          <Link href="/start?goal=interviews"><Braces size={20}/> Interview preparation <ArrowRight size={18}/></Link>
          <Link href="/start?goal=contests"><GitBranch size={20}/> Competitive programming <ArrowRight size={18}/></Link>
        </div>
      </div></section>
      <section className="shell faq"><div><div className="section-marker eyebrow"><span/> COMMON QUESTIONS</div><h2>Before you begin.</h2></div><div>
        <details><summary>Do I need coding experience?</summary><p>No. Start with input and output, then work up to tracing a search or a sort.</p></details>
        <details><summary>Can I switch programming languages?</summary><p>Yes. Choose C, Python or Java when setting up your path. You can switch languages in the lesson and practice workspace.</p></details>
        <details><summary>Do I need an account or an AI subscription?</summary><p>The guest lessons, visual lab, and authored hints are available without an account or an AI subscription. This browser keeps your settings and progress.</p></details>
      </div></section>
      <footer><div className="shell footer-inner"><Brand/><span>Learn. Think. Code. Compete. Master.</span><Link href="https://github.com/Kaushik2210/AlgoAscend">View source <ArrowUpRight size={16}/></Link></div></footer>
    </>
  );
}
