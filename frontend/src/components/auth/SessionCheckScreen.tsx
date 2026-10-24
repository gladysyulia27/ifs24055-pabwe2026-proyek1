import React from "react";
import Image from "next/image";

export function SessionCheckScreen() {
  return (
    <div className="auth-gate-page session-check">
      <div className="session-check-body">
        <Image src="/logo-bem-del.png" alt="Logo BEM IT Del" width={64} height={64} priority />
        <div>
          <h2>BEM Institut Teknologi Del</h2>
          <p>Memeriksa sesi login...</p>
        </div>
      </div>
    </div>
  );
}
