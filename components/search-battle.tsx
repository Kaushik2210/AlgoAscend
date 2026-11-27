import { GitCompareArrows } from "lucide-react";
import { linearFind } from "@/lib/trace";

export function SearchBattle({values,target,binaryCount,match}: {values: readonly number[]; target: number; binaryCount: number; match: number}) {
  const linear = linearFind(values,target);
  const max = Math.max(linear.comparisons,binaryCount,1);
  return <section className="battle">
    <h3><GitCompareArrows size={18} aria-hidden="true"/> Algorithm Battle</h3>
    <p>Find the first {target} in the applied array. {match < 0 ? "The target is absent." : `Both searches return index ${match}.`}</p>
    <dl>
      <div><dt>Binary search <code>O(log n)</code></dt><dd><span aria-hidden="true" className="battle-track"><i style={{width:`${100 * binaryCount / max}%`}}/></span><span>{binaryCount} {binaryCount === 1 ? "comparison" : "comparisons"}</span></dd></div>
      <div><dt>Linear search <code>O(n)</code></dt><dd><span aria-hidden="true" className="battle-track"><i style={{width:`${100 * linear.comparisons / max}%`}}/></span><span>{linear.comparisons} {linear.comparisons === 1 ? "comparison" : "comparisons"}</span></dd></div>
    </dl>
    <p>Try a target at the first index. A linear scan can win for that input, while binary search has a better worst-case bound on sorted data.</p>
  </section>;
}
