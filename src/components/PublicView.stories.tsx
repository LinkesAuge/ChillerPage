import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PublicView } from './PublicView';

const meta: Meta<typeof PublicView> = {
  title: 'Components/PublicView',
  component: PublicView,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof PublicView>;

export const Default: Story = {}; 