"use client";

import { Check, Code, Rocket, TestTube, Users } from "@phosphor-icons/react";

interface ProgressStepsProps {
  currentPhase: number; // 1, 2, 3, or 4
}

export default function ProgressSteps({ currentPhase }: ProgressStepsProps) {
  const steps = [
    { label: "Waitlist", sub: "Phase 1", icon: Users },
    { label: "Development", sub: "Phase 2", icon: Code },
    { label: "Testing", sub: "Phase 3", icon: TestTube },
    { label: "Launch", sub: "Phase 4", icon: Rocket },
  ];

  return (
    <ol className="relative w-full grid grid-cols-4" aria-label="Launch progress">
      {/* Chalk track behind the nodes */}
      <span className="absolute top-5 md:top-6 left-[12.5%] right-[12.5%] h-px bg-chalk/15" aria-hidden />

      {/* Filled track */}
      <span
        className="absolute top-5 md:top-6 left-[12.5%] h-px bg-lime transition-all duration-700 ease-out-expo"
        style={{ width: `calc(${((currentPhase - 1) / (steps.length - 1)) * 75}%)` }}
        aria-hidden
      />

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentPhase;
        const isActive = stepNum === currentPhase;
        const Icon = step.icon;

        return (
          <li
            key={step.label}
            className="relative z-10 flex flex-col items-center"
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                isCompleted
                  ? "bg-lime text-night"
                  : isActive
                  ? "bg-lime text-night live-dot"
                  : "bg-pitch border border-chalk/15 text-chalk/35"
              }`}
            >
              {isCompleted ? (
                <Check weight="bold" size={18} />
              ) : (
                <Icon weight={isActive ? "fill" : "regular"} size={18} />
              )}
            </div>

            <span
              className={`mt-3 text-[11px] xs:text-xs md:text-sm font-semibold text-center leading-tight ${
                isActive || isCompleted ? "text-chalk" : "text-chalk/40"
              }`}
            >
              {step.label}
            </span>
            <span className={`mt-0.5 font-wide text-[9px] xs:text-[10px] md:text-[11px] ${isActive || isCompleted ? "text-lime/80" : "text-moss/50"}`}>
              {step.sub}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
