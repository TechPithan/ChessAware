import Image from 'next/image';
import React from "react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#171717",
        color: "white",
        padding: "60px 20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        textAlign: "left",
      }}
    >
      {/* Logo & tagline */}
      <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
        <Image
          src="/Chess Aware Transparent White V2.png" // ← update this to your final file name
          alt="ChessAware Logo"
          width={150}
          height={50}
        />
        <p style={{ fontSize: "0.9rem", color: "#aaa", marginTop: "10px" }}>
          Elevate Your Chess Awareness.
        </p>
      </div>

      {/* Menu */}
      <div style={{ flex: "1 1 150px", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>Menu</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/" style={{ color: "#aaa", textDecoration: "none" }}>Home</a></li>
          <li><a href="#how-it-works" style={{ color: "#aaa", textDecoration: "none" }}>How it Works</a></li>
          <li><a href="#why-chessaware" style={{ color: "#aaa", textDecoration: "none" }}>Why ChessAware</a></li>
          <li><a href="#pricing" style={{ color: "#aaa", textDecoration: "none" }}>Pricing</a></li>
        </ul>
      </div>

      {/* Social */}
      <div style={{ flex: "1 1 150px", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>Follow Us</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#aaa" }}>
            <FaTwitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#aaa" }}>
            <FaLinkedin size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#aaa" }}>
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
