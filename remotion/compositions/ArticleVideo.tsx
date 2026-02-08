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
import { FPS, SCENE_DURATIONS, TRANSITION_FRAMES } from "../constants";
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

export const ArticleVideo: React.FC<ArticleVideoProps> = ({
  scenes,
  format,
}) => {
  return (
    <TransitionSeries>
      {scenes.map((scene, i) => {
        const durationInFrames = getSceneDurationInFrames(scene);

        return (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durationInFrames}>
              {scene.type === "title" && (
                <TitleScene scene={scene} format={format} />
              )}
              {scene.type === "content" && (
                <ContentScene scene={scene} format={format} />
              )}
              {scene.type === "cta" && (
                <CTAScene scene={scene} format={format} />
              )}
            </TransitionSeries.Sequence>
            {/* Cross-fade transition between scenes (not after the last one) */}
            {i < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: TRANSITION_FRAMES,
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
export function calculateTotalDuration(scenes: Scene[]): number {
  const scenesTotal = scenes.reduce(
    (sum, scene) => sum + getSceneDurationInFrames(scene),
    0
  );
  // Subtract overlap from transitions (each transition overlaps two scenes)
  const transitionOverlap = Math.max(0, scenes.length - 1) * TRANSITION_FRAMES;
  return scenesTotal - transitionOverlap;
}
