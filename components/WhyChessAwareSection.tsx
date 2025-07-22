import React from "react";

const WhyChessAwareSection: React.FC = () => {
  return (
    <section
      style={{
        backgroundColor: "#f7f3ff",
        color: "#171717",
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Why Choose ChessAware?
      </h2>
      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto 60px",
          fontSize: "1.2rem",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        Discover what makes ChessAware different and why it’s trusted by improving players.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ fontSize: "2rem", textAlign: "center" }}>✅</div>
          <h3 style={{ fontSize: "1.3rem", marginTop: "10px", fontWeight: "600", textAlign: "center" }}>
            Actionable Insights That Matter
          </h3>
          <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
            Go beyond cryptic stats. Get clear, practical pointers on common mistakes and areas to focus on next.
          </p>
        </div>

        <div>
          <div style={{ fontSize: "2rem", textAlign: "center" }}>🎯</div>
          <h3 style={{ fontSize: "1.3rem", marginTop: "10px", fontWeight: "600", textAlign: "center" }}>
            Tailored to Your Style
          </h3>
          <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
            ChessAware looks at your patterns and suggests improvements that align with your play style — not just generic tips.
          </p>
        </div>

        <div>
          <div style={{ fontSize: "2rem", textAlign: "center" }}>🚀</div>
          <h3 style={{ fontSize: "1.3rem", marginTop: "10px", fontWeight: "600", textAlign: "center" }}>
            See Your Progress, Move by Move
          </h3>
          <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
            Track your progress over time, celebrate small wins, and stay motivated on your journey to improvement.
          </p>
        </div>

        <div>
          <div style={{ fontSize: "2rem", textAlign: "center" }}>🧘</div>
          <h3 style={{ fontSize: "1.3rem", marginTop: "10px", fontWeight: "600", textAlign: "center" }}>
            Build a Stronger Mindset
          </h3>
          <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
            Strengthen your focus and strategic thinking, so you feel more confident and make better decisions over the board.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChessAwareSection;
