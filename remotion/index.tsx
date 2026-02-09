import React from "react";
import { Composition, registerRoot } from "remotion";
import { ArticleVideo, calculateTotalDuration } from "./compositions/ArticleVideo";
import { articleVideoPropsSchema } from "./schemas";
import type { ArticleVideoProps } from "./schemas";
import { FPS, SQUARE, VERTICAL } from "./constants";

// Sample data for Remotion Studio preview
const sampleScenes: ArticleVideoProps["scenes"] = [
  {
    type: "title",
    title: "AI Agents Can Now Browse the Web on Their Own",
    description:
      "New tools let AI systems navigate websites, fill forms, and complete tasks without human help.",
    tags: ["AI", "Agents", "Automation"],
  },
  {
    type: "content",
    heading: "What Happened",
    bullets: [
      "Several companies released AI agents that control a web browser autonomously",
      "These agents can click buttons, fill out forms, and navigate between pages",
      "They work by taking screenshots and deciding what to do next",
    ],
    slideNumber: 2,
    totalSlides: 6,
  },
  {
    type: "content",
    heading: "How It Works",
    bullets: [
      "The AI sees your screen like a person would and figures out where to click",
      "It breaks big tasks into small steps and completes them one by one",
      "Some tools run in the cloud while others work right on your computer",
    ],
    slideNumber: 3,
    totalSlides: 6,
  },
  {
    type: "content",
    heading: "Why It Matters",
    bullets: [
      "Repetitive online tasks could be handled by AI instead of you",
      "Small businesses could automate work they can't afford to hire for",
      "It raises big questions about security and who's responsible for AI actions",
    ],
    slideNumber: 4,
    totalSlides: 6,
  },
  {
    type: "content",
    heading: "What To Do",
    bullets: [
      "Try free demos from companies like Anthropic or OpenAI to see them in action",
      "Think about which repetitive tasks eat up most of your time",
      "Be cautious giving AI agents access to sensitive accounts or data",
    ],
    slideNumber: 5,
    totalSlides: 6,
  },
  {
    type: "cta",
    slideNumber: 6,
    totalSlides: 6,
  },
];

const defaultProps: ArticleVideoProps = {
  scenes: sampleScenes,
  format: "square",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ArticleVideoSquare"
        component={ArticleVideo}
        durationInFrames={calculateTotalDuration(sampleScenes, "square")}
        fps={FPS}
        width={SQUARE.width}
        height={SQUARE.height}
        schema={articleVideoPropsSchema}
        defaultProps={{ ...defaultProps, format: "square" }}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: calculateTotalDuration(props.scenes, props.format),
          };
        }}
      />
      <Composition
        id="ArticleVideoVertical"
        component={ArticleVideo}
        durationInFrames={calculateTotalDuration(sampleScenes, "vertical")}
        fps={FPS}
        width={VERTICAL.width}
        height={VERTICAL.height}
        schema={articleVideoPropsSchema}
        defaultProps={{ ...defaultProps, format: "vertical" }}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: calculateTotalDuration(props.scenes, props.format),
          };
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
