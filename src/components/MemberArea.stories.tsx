import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemberArea } from './MemberArea';

const meta: Meta<typeof MemberArea> = {
  title: 'Components/MemberArea',
  component: MemberArea,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MemberArea>;

export const Default: Story = {}; 