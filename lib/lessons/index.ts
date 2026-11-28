import { analysisBasics } from "./analysisBasics.ts";
import { applications } from "./applications.ts";
import { arrayAndMap } from "./arrayAndMap.ts";
import { corePatterns } from "./corePatterns.ts";
import { correctnessBasics } from "./correctnessBasics.ts";
import { decomposition } from "./decomposition.ts";
import { dynamicMemory } from "./dynamicMemory.ts";
import { earlyPractice } from "./earlyPractice.ts";
import { executionBasics } from "./executionBasics.ts";
import { fundamentals } from "./fundamentals.ts";
import { graphAndDp } from "./graphAndDp.ts";
import { graphColoring } from "./graphColoring.ts";
import { graphTraversal } from "./graphTraversal.ts";
import { greedyChoices } from "./greedyChoices.ts";
import { languageRecords } from "./languageRecords.ts";
import { linkedStructures } from "./linkedStructures.ts";
import { numberTheory } from "./numberTheory.ts";
import { optimization } from "./optimization.ts";
import { patternMatching } from "./patternMatching.ts";
import { queues } from "./queues.ts";
import { rangePatterns } from "./rangePatterns.ts";
import { rangeStructures } from "./rangeStructures.ts";
import { safeConversion } from "./safeConversion.ts";
import { searchPatterns } from "./searchPatterns.ts";
import { sequenceDp } from "./sequenceDp.ts";
import { structures } from "./structures.ts";
import { treeAndGrid } from "./treeAndGrid.ts";
import { weightedPaths } from "./weightedPaths.ts";
import { permutationBacktracking } from "./permutationBacktracking.ts";
import { combinatorics } from "./combinatorics.ts";
import { priorityQueues } from "./priorityQueues.ts";
import { mergeIntervals } from "./mergeIntervals.ts";
import { monotonicStack } from "./monotonicStack.ts";
import { monotonicDeque } from "./monotonicDeque.ts";
import { coordinateCompression } from "./coordinateCompression.ts";
import { sparseTables } from "./sparseTables.ts";
import { rollingHashes } from "./rollingHashes.ts";
import { increasingSubsequence } from "./increasingSubsequence.ts";
import { memoization } from "./memoization.ts";
import { ancestorQueries } from "./ancestorQueries.ts";
import { treeDiameter } from "./treeDiameter.ts";
import { negativePaths } from "./negativePaths.ts";
import { interviewWindows } from "./interviewWindows.ts";
import { interviewLinked } from "./interviewLinked.ts";
import { zeroOnePaths } from "./zeroOnePaths.ts";
import { spanningTrees } from "./spanningTrees.ts";
import { strongComponents } from "./strongComponents.ts";
import { lowLinkConnectivity } from "./lowLinkConnectivity.ts";
import { primTree } from "./primTree.ts";
import { eulerTrails } from "./eulerTrails.ts";
import { networkFlow } from "./networkFlow.ts";
import { bipartiteMatching } from "./bipartiteMatching.ts";
import { graphRepresentations } from "./graphRepresentations.ts";
import { undirectedCycles } from "./undirectedCycles.ts";
import { interviewGrid } from "./interviewGrid.ts";
import { interviewCache } from "./interviewCache.ts";
import { lazySegments } from "./lazySegments.ts";
import { palindromes } from "./palindromes.ts";
import { persistentSegments } from "./persistentSegments.ts";
import { ahoCorasick } from "./ahoCorasick.ts";
import { suffixArrays } from "./suffixArrays.ts";
import { longestCommonPrefixes } from "./longestCommonPrefixes.ts";
import { suffixAutomata } from "./suffixAutomata.ts";
import { squareRootBlocks } from "./squareRootBlocks.ts";
import { offlineQueries } from "./offlineQueries.ts";
import { orderedTreaps } from "./orderedTreaps.ts";
import { heavyLightPaths } from "./heavyLightPaths.ts";
import { centroidQueries } from "./centroidQueries.ts";
import { offlineConnectivity } from "./offlineConnectivity.ts";
import { prefixTries } from "./prefixTries.ts";
import { eulerTours } from "./eulerTours.ts";
import { rerootingTrees } from "./rerootingTrees.ts";
import { digitStates } from "./digitStates.ts";
import { commonMultiples } from "./commonMultiples.ts";
import { maskAssignments } from "./maskAssignments.ts";
import { modularInverses } from "./modularInverses.ts";

export const publishedTopics = [
  ...graphRepresentations, ...fundamentals, ...structures, ...optimization, ...applications, ...corePatterns,
  ...graphAndDp, ...numberTheory, ...queues, ...weightedPaths, ...rangeStructures,
  ...decomposition, ...earlyPractice, ...executionBasics, ...analysisBasics, ...correctnessBasics,
  ...linkedStructures, ...searchPatterns, ...rangePatterns, ...graphTraversal, ...treeAndGrid,
  ...sequenceDp, ...patternMatching, ...greedyChoices, ...graphColoring, ...languageRecords,
  ...arrayAndMap, ...safeConversion, ...dynamicMemory,
  ...permutationBacktracking, ...combinatorics,
  ...priorityQueues, ...mergeIntervals,
  ...monotonicStack, ...monotonicDeque, ...coordinateCompression,
  ...sparseTables, ...rollingHashes,
  ...increasingSubsequence, ...memoization,
  ...ancestorQueries, ...treeDiameter,
  ...negativePaths,
  ...interviewWindows, ...interviewLinked,
  ...zeroOnePaths, ...spanningTrees,
  ...strongComponents, ...lowLinkConnectivity,
  ...primTree, ...eulerTrails, ...networkFlow, ...bipartiteMatching,
  ...undirectedCycles, ...interviewGrid,
  ...interviewCache,
  ...lazySegments, ...palindromes,
  ...persistentSegments, ...ahoCorasick,
  ...suffixArrays, ...longestCommonPrefixes,
  ...suffixAutomata, ...squareRootBlocks,
  ...offlineQueries, ...orderedTreaps,
  ...heavyLightPaths, ...centroidQueries,
  ...offlineConnectivity, ...prefixTries,
  ...eulerTours, ...rerootingTrees,
  ...digitStates, ...commonMultiples,
  ...maskAssignments, ...modularInverses,
];
