// YourComponent.stories.tsx

import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BaseNode } from "./BaseNode";

// This default export determines where your story goes in the story list
export default {
  title: "Nodes/BaseNode",
  component: BaseNode,
  argTypes: {
    mainColor: { control: "color" },
  },
} as Meta;

const Template: Story<ComponentProps<typeof BaseNode>> = (args) => (
  <BaseNode {...args} />
);

export const FirstNode = Template.bind({});
FirstNode.args = {
  label: "Base Node",
};
