import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMentorQuestion, mentorMessages } from "../lib/mentor.ts";

test("mentor accepts only a known challenge, language and teaching mode", () => {
  const input = {problemId:"first-signal", language:"c", mode:"hint", question:"Why keep looking left?"};
  const question = parseMentorQuestion(input);
  assert.ok(question);
  assert.equal(parseMentorQuestion({...input,mode:"system"}), null);
  assert.equal(parseMentorQuestion({...input,question:"a".repeat(1201)}), null);
  assert.equal(parseMentorQuestion({...input,problemId:"unknown"}), null);
});

test("a learner question stays in the user message with no draft context", () => {
  const question = parseMentorQuestion({problemId:"first-signal",language:"c",mode:"socratic",question:"User-provided words",draft:"Private draft"})!;
  const messages = mentorMessages(question);
  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content,/Find the First Signal/);
  assert.match(messages[0].content,/one guiding question/);
  assert.doesNotMatch(messages[0].content,/User-provided words|Private draft/);
  assert.deepEqual(messages[1],{role:"user",content:"User-provided words"});
});
