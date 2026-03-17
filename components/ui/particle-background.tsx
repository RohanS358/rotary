"use client";

import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("./particles"), { ssr: false });

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Antigravity
        count={300}
        magnetRadius={19}
        ringRadius={13}
        waveSpeed={1.5}
        waveAmplitude={1}
        particleSize={1.2}
        lerpSpeed={0.05}
        color="#3584e4"
        autoAnimate
        particleVariance={1}
        rotationSpeed={0}
        depthFactor={1.9}
        pulseSpeed={3}
        particleShape="capsule"
        fieldStrength={10}
      />
    </div>
  );
}
