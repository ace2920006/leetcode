import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { m } from "framer-motion";
import { gsap } from "gsap";
import { problemApi, submissionApi } from "../lib/api/services";
import useAuth from "../context/useAuth";

const defaultSnippets = {
  python: 'print("Hello World")',
  java: "class Main { public static void main(String[] args) {} }",
  cpp: "#include <iostream>\nint main() { return 0; }",
};

function EditorPage() {
  const { slug } = useParams();
  const { setUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(defaultSnippets.python);
  const [output, setOutput] = useState("Run code to view output.");
  const [xpToast, setXpToast] = useState("");

  useEffect(() => {
    problemApi.detail(slug).then((response) => {
      setProblem(response.data);
      const starter = response.data.starterCodeByLanguage?.[language] || defaultSnippets[language];
      setCode(starter);
    });
  }, [slug, language]);

  useEffect(() => {
    if (xpToast) {
      gsap.fromTo(
        ".xp-toast",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [xpToast]);

  const visibleInput = useMemo(() => problem?.visibleTestCases?.[0]?.input || "", [problem]);

  const handleRun = async () => {
    const { data } = await submissionApi.run({
      problemId: problem._id,
      language,
      code,
      stdin: visibleInput,
    });
    setOutput(data.output || "(no output)");
  };

  const handleSubmit = async () => {
    const { data } = await submissionApi.submit({ problemId: problem._id, language, code });
    setOutput(data.message);
    if (data.progression) {
      setUser((prev) => ({ ...prev, ...data.progression }));
      if (data.progression.rewarded) {
        setXpToast(`+${problem.xpReward} XP`);
      }
    }
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <div className="rounded-lg border-2 border-[#58A6FF] bg-[#10192b] p-4">
        <h2 className="mb-2 text-xl font-bold">{problem.title}</h2>
        <p className="mb-4 text-sm text-slate-200">{problem.description}</p>
        <h3 className="mb-1 font-semibold">Example</h3>
        <pre className="rounded bg-[#0b1322] p-2 text-xs">{problem.visibleTestCases?.[0]?.input || "N/A"}</pre>
      </div>
      <div className="space-y-3 rounded-lg border-2 border-[#7C3AED] bg-[#10192b] p-3">
        <div className="flex items-center justify-between">
          <select
            className="rounded border-2 border-[#58A6FF] bg-[#0d1117] px-2 py-1"
            value={language}
            onChange={(e) => {
              const nextLanguage = e.target.value;
              setLanguage(nextLanguage);
              setCode(problem.starterCodeByLanguage?.[nextLanguage] || defaultSnippets[nextLanguage]);
            }}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <div className="space-x-2">
            <button type="button" onClick={handleRun} className="rounded border-2 border-[#58A6FF] px-3 py-1">
              Run
            </button>
            <button type="button" onClick={handleSubmit} className="rounded border-2 border-[#3FB950] px-3 py-1">
              Submit
            </button>
          </div>
        </div>
        <Editor
          height="360px"
          theme="vs-dark"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
        <div className="rounded border-2 border-[#58A6FF] bg-[#0b1322] p-2">
          <p className="text-xs uppercase text-slate-400">Output</p>
          <pre className="whitespace-pre-wrap text-sm">{output}</pre>
        </div>
        {xpToast && (
          <m.div className="xp-toast rounded border-2 border-[#FFD700] bg-[#FFD70022] p-2 text-center font-bold text-[#FFD700]">
            {xpToast}
          </m.div>
        )}
      </div>
    </div>
  );
}

export default EditorPage;
