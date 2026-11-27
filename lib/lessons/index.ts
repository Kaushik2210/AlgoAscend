import { applications } from "./applications.ts";
import { corePatterns } from "./corePatterns.ts";
import { fundamentals } from "./fundamentals.ts";
import { graphAndDp } from "./graphAndDp.ts";
import { numberTheory } from "./numberTheory.ts";
import { optimization } from "./optimization.ts";
import { structures } from "./structures.ts";

export const publishedTopics = [...fundamentals,...structures,...optimization,...applications,...corePatterns,...graphAndDp,...numberTheory];
