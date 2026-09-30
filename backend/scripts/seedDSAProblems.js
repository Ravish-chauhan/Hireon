require("dotenv").config();
const mongoose = require("mongoose");
const DSAProblem = require("../src/dsa-interview/models/dsaProblem.model");

// ===================================
// Dummy DSA Problem Seed Data
// ===================================

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "easy",
    topics: ["array", "hash-table"],
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
      { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" },
    ],
    expectedApproaches: ["Brute force O(n²)", "Hash map O(n)"],
    optimalApproach: "Use a hash map to store complement values. For each element, check if its complement exists in the map.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    starterCode: [
      { language: "javascript", code: "function twoSum(nums, target) {\n  // Your code here\n}" },
      { language: "python", code: "def twoSum(nums, target):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};" },
    ],
    hints: [
      "Think about what value you need to find for each element.",
      "A hash map can help you look up values in O(1) time.",
      "For each element, check if (target - element) exists in the hash map.",
    ],
    visibleTestCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "" },
      { input: "[3,2,4], 6", output: "[1,2]", explanation: "" },
    ],
    hiddenTestCases: [
      { input: "[3,3], 6", output: "[0,1]", explanation: "" },
      { input: "[1,2,3,4,5], 9", output: "[3,4]", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "easy",
    topics: ["string", "stack"],
    description:
      "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'",
    ],
    examples: [
      { input: 's = "()"', output: "true", explanation: "" },
      { input: 's = "()[]{}"', output: "true", explanation: "" },
      { input: 's = "(]"', output: "false", explanation: "" },
    ],
    expectedApproaches: ["Stack-based approach"],
    optimalApproach: "Use a stack. Push opening brackets, pop and compare for closing brackets.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    starterCode: [
      { language: "javascript", code: "function isValid(s) {\n  // Your code here\n}" },
      { language: "python", code: "def isValid(s):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n        return false;\n    }\n};" },
    ],
    hints: [
      "Consider using a stack data structure.",
      "Map each closing bracket to its corresponding opening bracket.",
      "At the end, the stack should be empty for a valid string.",
    ],
    visibleTestCases: [
      { input: '"()"', output: "true", explanation: "" },
      { input: '"()[]{}"', output: "true", explanation: "" },
      { input: '"(]"', output: "false", explanation: "" },
    ],
    hiddenTestCases: [
      { input: '"([)]"', output: "false", explanation: "" },
      { input: '"{[]}"', output: "true", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "easy",
    topics: ["array", "binary-search"],
    description:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." },
    ],
    expectedApproaches: ["Iterative binary search", "Recursive binary search"],
    optimalApproach: "Use two pointers (left, right) and repeatedly check the middle element.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    starterCode: [
      { language: "javascript", code: "function search(nums, target) {\n  // Your code here\n}" },
      { language: "python", code: "def search(nums, target):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};" },
    ],
    hints: [
      "Compare the target with the middle element of the array.",
      "If the target is less than the middle, search the left half.",
      "If the target is greater than the middle, search the right half.",
    ],
    visibleTestCases: [
      { input: "[-1,0,3,5,9,12], 9", output: "4", explanation: "" },
      { input: "[-1,0,3,5,9,12], 2", output: "-1", explanation: "" },
    ],
    hiddenTestCases: [
      { input: "[5], 5", output: "0", explanation: "" },
      { input: "[2,5], 5", output: "1", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "medium",
    topics: ["array", "dynamic-programming", "divide-and-conquer"],
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." },
      { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "The subarray [5,4,-1,7,8] has the largest sum 23." },
    ],
    expectedApproaches: ["Brute force O(n²)", "Kadane's algorithm O(n)", "Divide and conquer O(n log n)"],
    optimalApproach: "Kadane's algorithm: Track current sum and max sum. Reset current sum to 0 when it goes negative.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCode: [
      { language: "javascript", code: "function maxSubArray(nums) {\n  // Your code here\n}" },
      { language: "python", code: "def maxSubArray(nums):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};" },
    ],
    hints: [
      "Think about when it's better to start a new subarray vs. extending the current one.",
      "If the current sum becomes negative, starting fresh is always better.",
      "Track both the current running sum and the maximum sum seen so far.",
    ],
    visibleTestCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "" },
      { input: "[1]", output: "1", explanation: "" },
    ],
    hiddenTestCases: [
      { input: "[5,4,-1,7,8]", output: "23", explanation: "" },
      { input: "[-1]", output: "-1", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "medium",
    topics: ["string", "hash-table", "sliding-window"],
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
    ],
    expectedApproaches: ["Brute force O(n³)", "Sliding window with hash set O(n)"],
    optimalApproach: "Sliding window: Maintain a window with two pointers and a set of characters.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m, n)) where m is charset size",
    starterCode: [
      { language: "javascript", code: "function lengthOfLongestSubstring(s) {\n  // Your code here\n}" },
      { language: "python", code: "def lengthOfLongestSubstring(s):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n        return 0;\n    }\n};" },
    ],
    hints: [
      "Consider a sliding window approach.",
      "Use a set or map to track characters in the current window.",
      "When a duplicate is found, shrink the window from the left.",
    ],
    visibleTestCases: [
      { input: '"abcabcbb"', output: "3", explanation: "" },
      { input: '"bbbbb"', output: "1", explanation: "" },
    ],
    hiddenTestCases: [
      { input: '"pwwkew"', output: "3", explanation: "" },
      { input: '""', output: "0", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    difficulty: "easy",
    topics: ["linked-list", "two-pointers"],
    description:
      "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. Note that `pos` is not passed as a parameter.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list.",
    ],
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)." },
      { input: "head = [1,2], pos = 0", output: "true", explanation: "There is a cycle in the linked list, where the tail connects to the 0th node." },
      { input: "head = [1], pos = -1", output: "false", explanation: "There is no cycle in the linked list." },
    ],
    expectedApproaches: ["Hash set O(n) space", "Floyd's cycle detection (tortoise and hare) O(1) space"],
    optimalApproach: "Floyd's algorithm: Use slow and fast pointers. If they meet, there's a cycle.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCode: [
      { language: "javascript", code: "function hasCycle(head) {\n  // Your code here\n}" },
      { language: "python", code: "def hasCycle(head):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Your code here\n        return false;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Your code here\n        return false;\n    }\n};" },
    ],
    hints: [
      "Can you use two pointers moving at different speeds?",
      "If there's a cycle, a fast pointer will eventually catch up to a slow pointer.",
      "Floyd's algorithm uses a slow pointer (1 step) and a fast pointer (2 steps).",
    ],
    visibleTestCases: [
      { input: "[3,2,0,-4], pos = 1", output: "true", explanation: "" },
      { input: "[1], pos = -1", output: "false", explanation: "" },
    ],
    hiddenTestCases: [
      { input: "[1,2], pos = 0", output: "true", explanation: "" },
      { input: "[], pos = -1", output: "false", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "medium",
    topics: ["array", "sorting"],
    description:
      "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." },
    ],
    expectedApproaches: ["Sort + linear merge O(n log n)"],
    optimalApproach: "Sort by start time, then iterate and merge overlapping intervals.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    starterCode: [
      { language: "javascript", code: "function merge(intervals) {\n  // Your code here\n}" },
      { language: "python", code: "def merge(intervals):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Your code here\n        return {};\n    }\n};" },
    ],
    hints: [
      "Sort the intervals by their start value first.",
      "Compare each interval with the last merged interval.",
      "If they overlap, extend the end of the last merged interval.",
    ],
    visibleTestCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "" },
      { input: "[[1,4],[4,5]]", output: "[[1,5]]", explanation: "" },
    ],
    hiddenTestCases: [
      { input: "[[1,4],[0,4]]", output: "[[0,4]]", explanation: "" },
      { input: "[[1,4],[2,3]]", output: "[[1,4]]", explanation: "" },
    ],
    source: "manual",
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "medium",
    topics: ["array", "dfs", "bfs", "matrix"],
    description:
      'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: "1",
        explanation: "",
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: "3",
        explanation: "",
      },
    ],
    expectedApproaches: ["DFS flood fill", "BFS flood fill", "Union-Find"],
    optimalApproach: "DFS/BFS: Iterate through the grid. When a '1' is found, increment count and flood-fill to mark the entire island.",
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n) worst case for recursion stack",
    starterCode: [
      { language: "javascript", code: "function numIslands(grid) {\n  // Your code here\n}" },
      { language: "python", code: "def numIslands(grid):\n    # Your code here\n    pass" },
      { language: "java", code: "class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n        return 0;\n    }\n}" },
      { language: "cpp", code: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Your code here\n        return 0;\n    }\n};" },
    ],
    hints: [
      "Think of this as a graph traversal problem.",
      "When you find land ('1'), use DFS or BFS to visit all connected land cells.",
      "Mark visited cells to avoid counting the same island twice.",
    ],
    visibleTestCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "" },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "" },
    ],
    hiddenTestCases: [
      { input: '[["1"]]', output: "1", explanation: "" },
      { input: '[["0"]]', output: "0", explanation: "" },
    ],
    source: "manual",
  },
];

// ===================================
// Seed Function
// ===================================

async function seedDSAProblems() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Upsert each problem (avoid duplicates on re-run)
    for (const problem of problems) {
      await DSAProblem.findOneAndUpdate(
        { slug: problem.slug },
        problem,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded: ${problem.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${problems.length} DSA problems`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDSAProblems();
