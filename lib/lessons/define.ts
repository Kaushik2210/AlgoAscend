import type { Lesson, Language } from "../curriculum.ts";
import type { Problem } from "../problems.ts";

export type WorkedStep = { state: string; explanation: string };

export type Topic = {
  id: string;
  stage: number;
  title: string;
  minutes?: number;
  objective: string;
  prerequisites: string;
  analogy: string;
  explanation: string;
  invariant: string;
  pseudocode: string;
  time: string;
  space: string;
  trace: [state: string, explanation: string][];
  misconception: string;
  debug: string;
  fill: string;
  edgeCases: string[];
  revision: string;
  further: string;
  quiz: {question: string; answers: string[]; correct: number; feedback: string};
  practice: {title: string; description: string; format: string; constraints: string; input: string; output: string; hints: string[]};
  code: Record<Language,string>;
};

export function defineTopics(topics: Topic[]) {
  return topics.map(topic => {
    const problemId = `${topic.id}-practice`;
    const lesson: Lesson = {
      id:topic.id, stage:topic.stage, title:topic.title, minutes:topic.minutes ?? 12,
      objective:topic.objective, prerequisites:topic.prerequisites, analogy:topic.analogy,
      explanation:topic.explanation, formal:topic.invariant, pseudocode:topic.pseudocode,
      runtime:topic.time, memory:topic.space, walkthrough:topic.trace.map(([,detail]) => detail).join(" "),
      workedTrace:topic.trace.map(([state,explanation]) => ({state,explanation})),
      mistakes:topic.misconception, edge:topic.edgeCases.join(" "), debug:topic.debug, fill:topic.fill,
      revision:topic.revision, further:topic.further, ...topic.quiz, problem:problemId, code:topic.code,
    };

    const problem: Problem = {
      id:problemId, title:topic.practice.title, topic:topic.title, lesson:topic.id,
      description:topic.practice.description, format:topic.practice.format,
      constraints:topic.practice.constraints,
      sample:{stdin:topic.practice.input,expected:topic.practice.output},
      hints:topic.practice.hints,
      editorial:{
        approach:topic.explanation,
        correctness:topic.invariant,
        complexity:`${topic.time}. ${topic.space}.`,
        edgeCases:topic.edgeCases,
      },
    };
    return {lesson,problem};
  });
}
