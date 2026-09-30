// ===================================
// Language Harness Builder
// ===================================

/**
 * Builds an isolated executable script wrapping the candidate's code
 * with a standardized input reader and output serializer.
 *
 * @param {string} language - javascript | python | java | cpp
 * @param {string} candidateCode - Candidate's solution code
 * @param {Object} [problem] - Problem details (slug, title, etc.)
 * @returns {string} Complete source code ready for sandbox compilation/execution
 */
function buildHarness(language, candidateCode, problem = {}) {
  const lang = (language || "javascript").toLowerCase();
  const slug = (problem.slug || "").toLowerCase();

  switch (lang) {
    case "python":
      return buildPythonHarness(candidateCode, slug);
    case "javascript":
      return buildJavaScriptHarness(candidateCode, slug);
    case "java":
      return buildJavaHarness(candidateCode, slug);
    case "cpp":
      return buildCppHarness(candidateCode, slug);
    default:
      return candidateCode;
  }
}

// ----------------------------------------------------------------
// Python Harness
// ----------------------------------------------------------------
function buildPythonHarness(code, slug) {
  // If candidate already wrote their own standalone script reading stdin
  if (code.includes("sys.stdin") || code.includes("__name__ == '__main__'") || code.includes('__name__ == "__main__"')) {
    return code;
  }

  return `import sys, json

# ==================== CANDIDATE CODE ====================
${code}
# ========================================================

if __name__ == '__main__':
    try:
        raw = sys.stdin.read().strip()
        if raw:
            # Parse arguments as JSON array
            args = json.loads('[' + raw + ']')
            fn = None
            known_methods = ['twoSum', 'isValid', 'search', 'maxSubArray', 'lengthOfLongestSubstring', 'hasCycle', 'merge', 'numIslands', 'solution']
            for name in known_methods:
                if name in globals() and callable(globals()[name]):
                    fn = globals()[name]
                    break
            if not fn and 'Solution' in globals():
                inst = globals()['Solution']()
                for m in dir(inst):
                    if not m.startswith('_') and callable(getattr(inst, m)):
                        fn = getattr(inst, m)
                        break
            if fn:
                res = fn(*args)
                if isinstance(res, bool):
                    print("true" if res else "false")
                else:
                    print(json.dumps(res, separators=(',', ':')))
    except Exception as e:
        sys.stderr.write(str(e) + '\\n')
        sys.exit(1)
`;
}

// ----------------------------------------------------------------
// JavaScript Harness
// ----------------------------------------------------------------
function buildJavaScriptHarness(code, slug) {
  if (code.includes("fs.readFileSync(0") || code.includes("process.stdin")) {
    return code;
  }

  return `
// ==================== CANDIDATE CODE ====================
${code}
// ========================================================

const fs = require('fs');
try {
  const stdin = fs.readFileSync(0, 'utf-8').trim();
  if (stdin) {
    const args = JSON.parse('[' + stdin + ']');
    let fn = null;
    const knownNames = ['twoSum', 'isValid', 'search', 'maxSubArray', 'lengthOfLongestSubstring', 'hasCycle', 'merge', 'numIslands', 'solution'];
    for (const name of knownNames) {
      try {
        if (typeof eval(name) === 'function') {
          fn = eval(name);
          break;
        }
      } catch (err) {}
    }
    if (fn) {
      const res = fn(...args);
      console.log(JSON.stringify(res));
    }
  }
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
`;
}

// ----------------------------------------------------------------
// Java Harness
// ----------------------------------------------------------------
function buildJavaHarness(code, slug) {
  // If candidate already has public class Main, leave as-is
  if (code.includes("public class Main")) {
    return code;
  }

  // Ensure Solution class is not public if in same compilation unit
  let cleanedCode = code.replace(/public\s+class\s+Solution/g, "class Solution");

  return `import java.util.*;
import java.io.*;

// ==================== CANDIDATE CODE ====================
${cleanedCode}
// ========================================================

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        StringBuilder sb = new StringBuilder();
        while (sc.hasNextLine()) {
            sb.append(sc.nextLine()).append("\\n");
        }
        String input = sb.toString().trim();
        if (input.isEmpty()) return;

        Solution sol = new Solution();

        // Problem-specific runner
        ${getJavaRunnerCode(slug)}
    }
}
`;
}

function getJavaRunnerCode(slug) {
  switch (slug) {
    case "two-sum":
    case "two-sum-test":
      return `
        int closeBracket = input.indexOf(']');
        String arrayPart = input.substring(1, closeBracket).trim();
        String[] numStrs = arrayPart.split(",\\\\s*");
        int[] nums = new int[numStrs.length];
        for (int i = 0; i < numStrs.length; i++) nums[i] = Integer.parseInt(numStrs[i].trim());
        int target = Integer.parseInt(input.substring(closeBracket + 1).replace(",", "").trim());
        int[] res = sol.twoSum(nums, target);
        System.out.println(Arrays.toString(res).replace(" ", ""));
      `;
    case "valid-parentheses":
      return `
        String s = input.replace("\\"", "").trim();
        boolean res = sol.isValid(s);
        System.out.println(res ? "true" : "false");
      `;
    case "binary-search":
      return `
        int closeBracket = input.indexOf(']');
        String arrayPart = input.substring(1, closeBracket).trim();
        String[] numStrs = arrayPart.split(",\\\\s*");
        int[] nums = new int[numStrs.length];
        for (int i = 0; i < numStrs.length; i++) nums[i] = Integer.parseInt(numStrs[i].trim());
        int target = Integer.parseInt(input.substring(closeBracket + 1).replace(",", "").trim());
        int res = sol.search(nums, target);
        System.out.println(res);
      `;
    case "maximum-subarray":
      return `
        String clean = input.replace("[", "").replace("]", "").trim();
        String[] parts = clean.split(",\\\\s*");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        int res = sol.maxSubArray(nums);
        System.out.println(res);
      `;
    default:
      return `
        // Default reflection fallback
        java.lang.reflect.Method[] methods = Solution.class.getDeclaredMethods();
        for (java.lang.reflect.Method m : methods) {
            if (!m.getName().startsWith("_")) {
                m.setAccessible(true);
                // Call single string or no-arg
                if (m.getParameterCount() == 1 && m.getParameterTypes()[0] == String.class) {
                    Object res = m.invoke(sol, input);
                    System.out.println(String.valueOf(res));
                    return;
                }
            }
        }
      `;
  }
}

// ----------------------------------------------------------------
// C++ Harness
// ----------------------------------------------------------------
function buildCppHarness(code, slug) {
  if (code.includes("int main(")) {
    return code;
  }

  return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <stack>
#include <algorithm>

using namespace std;

// ==================== CANDIDATE CODE ====================
${code}
// ========================================================

int main() {
    string input;
    if (!getline(cin, input)) return 0;
    while (input.length() > 0 && (input.back() == '\\r' || input.back() == '\\n' || input.back() == ' ')) input.pop_back();
    if (input.empty()) return 0;

    Solution sol;
    ${getCppRunnerCode(slug)}
    return 0;
}
`;
}

function getCppRunnerCode(slug) {
  switch (slug) {
    case "two-sum":
    case "two-sum-test":
      return `
        size_t closeBracket = input.find(']');
        string arrStr = input.substr(1, closeBracket - 1);
        vector<int> nums;
        stringstream ss(arrStr);
        string token;
        while (getline(ss, token, ',')) {
            while (!token.empty() && token.front() == ' ') token.erase(token.begin());
            if (!token.empty()) nums.push_back(stoi(token));
        }
        string targetStr = input.substr(closeBracket + 1);
        while (!targetStr.empty() && (targetStr.front() == ',' || targetStr.front() == ' ')) targetStr.erase(targetStr.begin());
        int target = stoi(targetStr);

        vector<int> res = sol.twoSum(nums, target);
        cout << "[";
        for (size_t i = 0; i < res.size(); ++i) {
            cout << res[i] << (i + 1 < res.size() ? "," : "");
        }
        cout << "]" << endl;
      `;
    case "valid-parentheses":
      return `
        string s = input;
        while (!s.empty() && s.front() == '"') s.erase(s.begin());
        while (!s.empty() && s.back() == '"') s.pop_back();
        bool res = sol.isValid(s);
        cout << (res ? "true" : "false") << endl;
      `;
    case "binary-search":
      return `
        size_t closeBracket = input.find(']');
        string arrStr = input.substr(1, closeBracket - 1);
        vector<int> nums;
        stringstream ss(arrStr);
        string token;
        while (getline(ss, token, ',')) {
            while (!token.empty() && token.front() == ' ') token.erase(token.begin());
            if (!token.empty()) nums.push_back(stoi(token));
        }
        string targetStr = input.substr(closeBracket + 1);
        while (!targetStr.empty() && (targetStr.front() == ',' || targetStr.front() == ' ')) targetStr.erase(targetStr.begin());
        int target = stoi(targetStr);
        int res = sol.search(nums, target);
        cout << res << endl;
      `;
    case "maximum-subarray":
      return `
        string clean = input;
        for (char &c : clean) if (c == '[' || c == ']') c = ' ';
        stringstream ss(clean);
        string token;
        vector<int> nums;
        while (getline(ss, token, ',')) {
            while (!token.empty() && token.front() == ' ') token.erase(token.begin());
            if (!token.empty()) nums.push_back(stoi(token));
        }
        int res = sol.maxSubArray(nums);
        cout << res << endl;
      `;
    default:
      return `
        cout << "ok" << endl;
      `;
  }
}

module.exports = {
  buildHarness,
};
