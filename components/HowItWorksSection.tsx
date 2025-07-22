import React from "react";

const HowItWorksSection: React.FC = () => {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        color: "#171717",
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "40px",
          fontWeight: "bold",
        }}
      >
        How It Works
      </h2>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          fontSize: "1.3rem",
          lineHeight: "1.6",
        }}
      >
        <p>📝 Enter your chess username (Chess.com or Lichess).</p>
        <p>⚡ Instantly fetch and analyse your games with one click.</p>
        <p>🚀 Receive personalised insights to level up your game!</p>
      </div>
    </section>
  );
};

export default HowItWorksSection;
