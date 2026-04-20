const connectDb = require("../config/db");
const Problem = require("../models/Problem");

const starterProblems = [
  {
    title: "Print Hello",
    slug: "print-hello",
    difficulty: "Easy",
    description: "Print exactly Hello World.",
    visibleTestCases: [{ input: " ", output: "Hello World" }],
    hiddenTestCases: [{ input: " ", output: "Hello World" }],
    starterCodeByLanguage: {
      python: 'print("Hello World")',
      java: "class Main { public static void main(String[] args) { System.out.print(\"Hello World\"); } }",
      cpp: "#include <iostream>\nint main(){ std::cout << \"Hello World\"; }",
    },
    xpReward: 50,
    topic: "Variables",
    order: 1,
  },
  {
    title: "Sum Two Numbers",
    slug: "sum-two-numbers",
    difficulty: "Easy",
    description: "Read two integers and print their sum.",
    visibleTestCases: [{ input: "2 3", output: "5" }],
    hiddenTestCases: [{ input: "10 -2", output: "8" }],
    xpReward: 60,
    topic: "Variables",
    order: 2,
  },
  {
    title: "Even or Odd",
    slug: "even-or-odd",
    difficulty: "Easy",
    description: "Read an integer and print Even if divisible by 2, else Odd.",
    visibleTestCases: [{ input: "4", output: "Even" }],
    hiddenTestCases: [{ input: "7", output: "Odd" }],
    xpReward: 70,
    topic: "Conditionals",
    order: 3,
  },
  {
    title: "Loop Counter",
    slug: "loop-counter",
    difficulty: "Medium",
    description: "Print numbers from 1 to N each on new line.",
    visibleTestCases: [{ input: "3", output: "1\n2\n3" }],
    hiddenTestCases: [{ input: "2", output: "1\n2" }],
    xpReward: 90,
    topic: "Loops",
    order: 4,
  },
  {
    title: "Square Function",
    slug: "square-function",
    difficulty: "Medium",
    description: "Read one integer and print its square.",
    visibleTestCases: [{ input: "5", output: "25" }],
    hiddenTestCases: [{ input: "-4", output: "16" }],
    xpReward: 100,
    topic: "Functions",
    order: 5,
  },
];

const run = async () => {
  await connectDb();
  await Problem.deleteMany({});
  await Problem.insertMany(starterProblems);
  // eslint-disable-next-line no-console
  console.log("Seeded starter problems");
  process.exit(0);
};

run();
