//component/script-chat.tsx

"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("fd227b31-75bd-4ee4-be40-56fd9ba138e0");
  }, []);

  return null;
};