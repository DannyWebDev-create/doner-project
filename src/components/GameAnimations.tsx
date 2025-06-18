"use client";

export default function GameAnimations() {
  return (
    <style jsx global>{`
      @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
      }
      
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(5deg); }
        100% { transform: translateY(0) rotate(-5deg); }
      }
    `}</style>
  );
}
