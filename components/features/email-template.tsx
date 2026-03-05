import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div
    style={{
      fontFamily: "'Inter', Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f4f4f4",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    }}
  >
    {/* Header */}
    <div
      style={{
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "24px" }}>Contact Form Submission</h1>
    </div>

    {/* Content */}
    <div
      style={{
        padding: "30px",
        backgroundColor: "white",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            margin: "0 0 15px 0",
            color: "#333",
            fontSize: "18px",
          }}
        >
          New Message Details
        </h2>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: "10px 0", color: "#666" }}>
            <strong
              style={{ color: "#333", display: "inline-block", width: "100px" }}
            >
              Name:
            </strong>
            {name}
          </p>
          <p style={{ margin: "10px 0", color: "#666" }}>
            <strong
              style={{ color: "#333", display: "inline-block", width: "100px" }}
            >
              Email:
            </strong>
            {email}
          </p>
          <p style={{ margin: "10px 0", color: "#666" }}>
            <strong
              style={{ color: "#333", display: "inline-block", width: "100px" }}
            >
              Subject:
            </strong>
            {subject}
          </p>
        </div>
      </div>

      <div>
        <h2
          style={{
            margin: "0 0 15px 0",
            color: "#333",
            fontSize: "18px",
          }}
        >
          Message
        </h2>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            color: "#666",
            lineHeight: "1.6",
          }}
        >
          {message}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      style={{
        backgroundColor: "#f4f4f4",
        color: "#888",
        textAlign: "center",
        padding: "15px",
        fontSize: "12px",
      }}
    >
      © {new Date().getFullYear()} Contact Form Submission
    </div>
  </div>
);
