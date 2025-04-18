import React from "react";
import { Button } from "@/components/ui/button";
import { designTokens } from "@/lib/designTokens";

/**
 * PublicView component replicates the Public View Example from the UI prototype.
 */
export function PublicView() {
  return (
    <div
      style={{ backgroundColor: designTokens.colors.card, borderColor: designTokens.colors.border }}
      className="border rounded p-6"
      aria-label="Public View Example"
    >
      <nav
        aria-label="Public Site Navigation"
        className="flex justify-between items-center mb-4"
      >
        <div
          className="text-2xl font-bold"
          style={{ color: designTokens.colors.textLight }}
        >
          Clan Logo
        </div>
        <div className="space-x-2">
          <Button variant="link">About</Button>
          <Button variant="link">Recruitment</Button>
          <Button>Login / Sign Up</Button>
        </div>
      </nav>
      <div className="text-center">
        <h3
          className="text-3xl font-bold mb-2"
          style={{ color: designTokens.colors.textOnDark }}
        >
          Welcome to [Clan Name]
        </h3>
        <p
          className="mb-4"
          style={{ color: designTokens.colors.textMuted }}
        >
          General description, recruitment info, public news snippet...
        </p>
        <Button style={{ backgroundColor: designTokens.colors.accentBg }}>
          Learn More
        </Button>
      </div>
    </div>
  );
} 