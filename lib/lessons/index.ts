import { applications } from "./applications.ts";
import { corePatterns } from "./corePatterns.ts";
import { decomposition } from "./decomposition.ts";
import { earlyPractice } from "./earlyPractice.ts";
import { fundamentals } from "./fundamentals.ts";
import { graphAndDp } from "./graphAndDp.ts";
import { numberTheory } from "./numberTheory.ts";
import { optimization } from "./optimization.ts";
import { queues } from "./queues.ts";
import { rangeStructures } from "./rangeStructures.ts";
import { structures } from "./structures.ts";
import { weightedPaths } from "./weightedPaths.ts";

export const publishedTopics = [
  ...fundamentals, ...structures, ...optimization, ...applications,
  ...corePatterns, ...graphAndDp, ...numberTheory, ...queues, ...weightedPaths, ...rangeStructures,
  ...decomposition, ...earlyPractice,
];
