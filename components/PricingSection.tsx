import React from "react";

const PricingSection: React.FC = () => {
  return (
    <section
      style={{
        backgroundColor: "#ffffff", // ← changed to white
        color: "#171717",
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "20px", fontWeight: "bold" }}>
        Pricing Details Coming Soon...
      </h2>
      <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem", color: "#555" }}>
        Pricing details will be available soon. In the meantime, explore the platform for FREE and get ready to elevate your chess journey!
      </p>
    </section>
  );
};

export default PricingSection;
