import { applications } from "./applications.ts";
import { fundamentals } from "./fundamentals.ts";
import { optimization } from "./optimization.ts";
import { structures } from "./structures.ts";

export const publishedTopics = [...fundamentals,...structures,...optimization,...applications];
