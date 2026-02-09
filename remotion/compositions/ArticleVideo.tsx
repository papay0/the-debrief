import React from "react";
import { loadFont } from "@remotion/google-fonts/SourceSerif4";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleScene } from "./scenes/TitleScene";
import { ContentScene } from "./scenes/ContentScene";
import { CTAScene } from "./scenes/CTAScene";
import { ReelTitleScene } from "./scenes/reel/ReelTitleScene";
import { ReelContentScene } from "./scenes/reel/ReelContentScene";
import { ReelCTAScene } from "./scenes/reel/ReelCTAScene";
import { FPS, SCENE_DURATIONS, TRANSITION_FRAMES, REEL_TRANSITION_FRAMES } from "../constants";
import type { ArticleVideoProps, Scene } from "../schemas";

// Load Source Serif 4 from Google Fonts
const { fontFamily } = loadFont();

function getSceneDurationInFrames(scene: Scene): number {
  // If the scene has audio, use the audio duration
  if (scene.audio?.durationInSeconds) {
    // Add 1s padding for visual animations to settle
    return Math.ceil((scene.audio.durationInSeconds + 1) * FPS);
  }

  // Otherwise use default durations
  switch (scene.type) {
    case "title":
      return SCENE_DURATIONS.title * FPS;
    case "content":
      return SCENE_DURATIONS.content * FPS;
    case "cta":
      return SCENE_DURATIONS.cta * FPS;
  }
}

function getTransitionFrames(format: "square" | "vertical"): number {
  return format === "vertical" ? REEL_TRANSITION_FRAMES : TRANSITION_FRAMES;
}

export const ArticleVideo: React.FC<ArticleVideoProps> = ({
  scenes,
  format,
}) => {
  const isReel = format === "vertical";
  const transitionFrames = getTransitionFrames(format);

  return (
    <TransitionSeries>
      {scenes.map((scene, i) => {
        const durationInFrames = getSceneDurationInFrames(scene);

        return (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durationInFrames}>
              {scene.type === "title" &&
                (isReel ? (
                  <ReelTitleScene scene={scene} format={format} />
                ) : (
                  <TitleScene scene={scene} format={format} />
                ))}
              {scene.type === "content" &&
                (isReel ? (
                  <ReelContentScene scene={scene} format={format} />
                ) : (
                  <ContentScene scene={scene} format={format} />
                ))}
              {scene.type === "cta" &&
                (isReel ? (
                  <ReelCTAScene scene={scene} format={format} />
                ) : (
                  <CTAScene scene={scene} format={format} />
                ))}
            </TransitionSeries.Sequence>
            {/* Cross-fade transition between scenes (not after the last one) */}
            {i < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: transitionFrames,
                })}
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

/**
 * Calculate total duration of a video given its scenes.
 * Used by calculateMetadata and by the admin UI.
 */
export function calculateTotalDuration(
  scenes: Scene[],
  format: "square" | "vertical" = "square"
): number {
  const scenesTotal = scenes.reduce(
    (sum, scene) => sum + getSceneDurationInFrames(scene),
    0
  );
  const transitionFrames = getTransitionFrames(format);
  // Subtract overlap from transitions (each transition overlaps two scenes)
  const transitionOverlap = Math.max(0, scenes.length - 1) * transitionFrames;
  return scenesTotal - transitionOverlap;
}
