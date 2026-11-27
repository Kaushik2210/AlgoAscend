import { analysisBasics } from "./analysisBasics.ts";
import { applications } from "./applications.ts";
import { corePatterns } from "./corePatterns.ts";
import { correctnessBasics } from "./correctnessBasics.ts";
import { decomposition } from "./decomposition.ts";
import { earlyPractice } from "./earlyPractice.ts";
import { executionBasics } from "./executionBasics.ts";
import { fundamentals } from "./fundamentals.ts";
import { graphAndDp } from "./graphAndDp.ts";
import { linkedStructures } from "./linkedStructures.ts";
import { numberTheory } from "./numberTheory.ts";
import { optimization } from "./optimization.ts";
import { queues } from "./queues.ts";
import { rangeStructures } from "./rangeStructures.ts";
import { structures } from "./structures.ts";
import { weightedPaths } from "./weightedPaths.ts";

export const publishedTopics = [
  ...fundamentals, ...structures, ...optimization, ...applications, ...corePatterns,
  ...graphAndDp, ...numberTheory, ...queues, ...weightedPaths, ...rangeStructures,
  ...decomposition, ...earlyPractice, ...executionBasics, ...analysisBasics, ...correctnessBasics,
  ...linkedStructures,
];
