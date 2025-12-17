import type React from "react";
import { useSelector } from "react-redux";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((store: any) => store.auth);

  if (!user) return null;

  return <>{children}</>;
}
