import { defineTopics } from "./define.ts";

export const interviewGrid = defineTopics([
  {
    "id": "interview-grid-bfs",
    "stage": 14,
    "minutes": 30,
    "title": "Coding mock: multi-source grid BFS",
    "objective": "Translate a grid into an implicit graph and explain why one BFS can start from several cells.",
    "prerequisites": "Breadth-first search, queues, and two-dimensional indexing.",
    "analogy": "Start several cleanup crews at the same moment. Each open square cares when the first crew reaches it.",
    "explanation": "In a 30-minute mock, first clarify whether movement is orthogonal, whether walls can be crossed, and what happens when open cells are unreachable. Explain the baseline of repeating BFS from each source. Improve it by enqueueing every source at time zero. Expand unvisited orthogonal neighbors, then report the maximum earliest arrival time if every open cell was reached.",
    "invariant": "A cell is enqueued only the first time it is reached. FIFO order processes nondecreasing times, so its assigned time is the minimum over all source-to-cell paths.",
    "pseudocode": "put every source into the queue with time 0\nwhile a cell remains:\n  pop it and check its four orthogonal neighbors\n  enqueue each unvisited open neighbor at current time+1\nif any open cell is unvisited: print −1\notherwise print the largest time, or 0 for an all-wall grid",
    "time": "O(rows × columns) for initialization and BFS",
    "space": "O(rows × columns) for distances, grid and queue",
    "trace": [
      [
        "Grid S... / .#.. / ...S",
        "The two sources begin at opposite corners. The center-left wall is impassable."
      ],
      [
        "Queue both S cells at time 0",
        "Each source can begin expanding immediately."
      ],
      [
        "First layer: time 1",
        "Mark orthogonal neighbors of either source. Never enqueue the same square twice."
      ],
      [
        "Second layer finishes the grid",
        "The last reached open cells are two steps from their nearest source. Report 2."
      ]
    ],
    "misconception": "Starting a separate search per source adds avoidable work and can complicate comparing arrival times.",
    "debug": "Use a wall partition that separates one open region from every source. A finite maximum ignores that unreachable region.",
    "fill": "When should a new cell be marked visited: before enqueueing it, or after removing it?",
    "edgeCases": [
      "An all-wall grid has no open cells and returns zero.",
      "If no source exists and some open cell exists, return −1.",
      "All sources start at time zero."
    ],
    "revision": "Explain the implicit graph, the FIFO invariant, and the unreachable-cell check aloud.",
    "further": "Record the source that reached each cell first and discuss how tie-breaking affects source IDs without changing distances.",
    "quiz": {
      "question": "Why queue every source before starting BFS?",
      "answers": [
        "To give all sources arrival time zero",
        "To ensure paths can cross walls",
        "To avoid storing distances"
      ],
      "correct": 0,
      "feedback": "Queueing all sources at time zero lets each BFS layer reflect the nearest source to every reached cell."
    },
    "practice": {
      "title": "Cover the warehouse from several stations",
      "description": "Find the time needed for all open warehouse cells to be reached by their nearest station.",
      "format": "Read R C, then R grid rows. A station is S, an open cell is ., and a wall is #. A move takes one step in the four orthogonal directions. Print the latest earliest arrival time, −1 if any open cell is unreachable, or 0 for an all-wall grid.",
      "constraints": "1 ≤ R,C ≤ 24.",
      "input": "3 4\nS...\n.#..\n...S\n",
      "output": "2\n",
      "hints": [
        "Put all stations in the queue before expanding.",
        "Use an unreachable marker distinct from zero."
      ]
    },
    code: {
      c: `#include <stdio.h>
static char grid[24][25];
static int d[24][24], queue[576];
int main(void) {
    int rows, cols, head = 0, tail = 0;
    static const int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    if (scanf("%d%d", &rows, &cols) != 2) return 0;
    for (int r = 0; r < rows; r++) {
        scanf("%24s", grid[r]);
        for (int c = 0; c < cols; c++) {
            d[r][c] = -1;
            if (grid[r][c] == 'S') { d[r][c] = 0; queue[tail++] = r * cols + c; }
        }
    }
    while (head < tail) {
        int cell = queue[head++], r = cell / cols, c = cell % cols;
        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] == '#' || d[nr][nc] != -1) continue;
            d[nr][nc] = d[r][c] + 1;
            queue[tail++] = nr * cols + nc;
        }
    }
    int best = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        if (grid[r][c] == '#') continue;
        if (d[r][c] == -1) { puts("-1"); return 0; }
        if (d[r][c] > best) best = d[r][c];
    }
    printf("%d\\n", best);
    return 0;
}`,
      python: `from collections import deque
rows, cols = map(int, input().split())
grid = [input() for _ in range(rows)]
dist = [[-1] * cols for _ in range(rows)]
queue = deque()
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == "S":
            dist[r][c] = 0
            queue.append((r, c))
while queue:
    r, c = queue.popleft()
    for nr, nc in ((r-1,c), (r+1,c), (r,c-1), (r,c+1)):
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != "#" and dist[nr][nc] == -1:
            dist[nr][nc] = dist[r][c] + 1
            queue.append((nr, nc))
times = [dist[r][c] for r in range(rows) for c in range(cols) if grid[r][c] != "#"]
print(-1 if -1 in times else max(times, default=0))`,
      java: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int rows = in.nextInt(), cols = in.nextInt();
        String[] grid = new String[rows];
        int[][] d = new int[rows][cols];
        int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
        var queue = new ArrayDeque<Integer>();
        for (int r = 0; r < rows; r++) {
            grid[r] = in.next();
            Arrays.fill(d[r], -1);
            for (int c = 0; c < cols; c++) {
                if (grid[r].charAt(c) == 'S') { d[r][c] = 0; queue.add(r * cols + c); }
            }
        }
        while (!queue.isEmpty()) {
            int cell = queue.removeFirst(), r = cell / cols, c = cell % cols;
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (grid[nr].charAt(nc) == '#' || d[nr][nc] != -1) continue;
                d[nr][nc] = d[r][c] + 1;
                queue.addLast(nr * cols + nc);
            }
        }
        int best = 0;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
            if (grid[r].charAt(c) == '#') continue;
            if (d[r][c] == -1) { System.out.println(-1); return; }
            best = Math.max(best, d[r][c]);
        }
        System.out.println(best);
    }
}`,
    },
  }
]);
