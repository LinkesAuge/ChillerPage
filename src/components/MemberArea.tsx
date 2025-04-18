import React from 'react';
import { designTokens } from '@/lib/designTokens';
import { Card } from '@/components/ui/card';

/**
 * MemberArea component replicates the member-area layout from the UI prototype.
 */
export function MemberArea() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '16rem',                // 64 (Tailwind w-64)
          backgroundColor: designTokens.colors.sidebar,
          color: designTokens.colors.textLight,
          padding: designTokens.spacing.md,
        }}
        aria-label="Sidebar Navigation"
      >
        <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: designTokens.spacing.md }}>
          ChillerPage
        </div>
        <nav aria-label="Main Navigation">
          <a href="#" style={{ display: 'block', padding: designTokens.spacing.sm, color: designTokens.colors.textLight, textDecoration: 'none' }}>Dashboard</a>
          <a href="#" style={{ display: 'block', padding: designTokens.spacing.sm, color: designTokens.colors.textLight, textDecoration: 'none' }}>News & Articles</a>
          <a href="#" style={{ display: 'block', padding: designTokens.spacing.sm, color: designTokens.colors.textLight, textDecoration: 'none' }}>Members</a>
        </nav>
      </aside>
      <main
        style={{
          flex: 1,
          backgroundColor: designTokens.colors.content,
          color: designTokens.colors.textOnDark,
          padding: designTokens.spacing.md,
        }}
        aria-label="Main Content"
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: designTokens.spacing.lg }}>
          Member Dashboard
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: designTokens.spacing.md
        }}>
          <Card accent>
            <h4 style={{ fontWeight: 600, marginBottom: designTokens.spacing.sm }}>
              Pinned Announcement!
            </h4>
            <p>Important update regarding the next event...</p>
          </Card>
          <Card>
            <h4 style={{ fontWeight: 600, marginBottom: designTokens.spacing.sm }}>
              Latest News
            </h4>
            <p>Summary of the most recent article goes here...</p>
          </Card>
          <Card>
            <h4 style={{ fontWeight: 600, marginBottom: designTokens.spacing.sm }}>
              Your Stats
            </h4>
            <p>Chests Today: 5</p>
            <p>Total Score: 1250</p>
          </Card>
          <Card>
            <h4 style={{ fontWeight: 600, marginBottom: designTokens.spacing.sm }}>
              Clan Stats
            </h4>
            <p>Total Clan Score: 98765</p>
            <p>Active Members: 45</p>
          </Card>
        </div>
      </main>
    </div>
  );
} 