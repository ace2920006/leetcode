import { useEffect, useRef } from "react";
import gsap from "gsap";

function XPProgress({ xp = 0, level = 1 }) {
  const barRef = useRef(null);
  const levelXp = xp % 200;
  const progress = (levelXp / 200) * 100;

  useEffect(() => {
    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [progress]);

  return (
    <div>
      <p className="mb-2 text-sm font-semibold">Level {level} - {xp} XP</p>
      <div className="h-3 w-full rounded bg-[#263040]">
        <div ref={barRef} className="h-3 w-0 rounded bg-gradient-to-r from-[#7C3AED] to-[#58A6FF]" />
      </div>
    </div>
  );
}

export default XPProgress;
