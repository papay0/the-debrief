"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ArticleVideoProps } from "@/remotion/schemas";
import { calculateTotalDuration } from "@/remotion/compositions/ArticleVideo";
import { FPS, SQUARE, VERTICAL } from "@/remotion/constants";

// Dynamically import the Player with SSR disabled
const PlayerComponent = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

interface VideoPlayerWrapperProps {
  props: ArticleVideoProps;
}

export function VideoPlayerWrapper({ props }: VideoPlayerWrapperProps) {
  const dimensions =
    props.format === "vertical"
      ? { width: VERTICAL.width, height: VERTICAL.height }
      : { width: SQUARE.width, height: SQUARE.height };

  const durationInFrames = calculateTotalDuration(props.scenes, props.format);

  const isVertical = props.format === "vertical";
  const maxWidth = isVertical ? 400 : 600;

  // Lazily import the component for the Player
  const LazyComponent = useMemo(
    () =>
      React.lazy(() =>
        import("@/remotion/compositions/ArticleVideo").then((mod) => ({
          default: mod.ArticleVideo as React.FC<Record<string, unknown>>,
        }))
      ),
    []
  );

  return (
    <div className="mx-auto" style={{ maxWidth }}>
      {PlayerComponent && (
        <PlayerComponent
          key={props.format}
          component={LazyComponent}
          inputProps={props}
          durationInFrames={Math.max(1, durationInFrames)}
          compositionWidth={dimensions.width}
          compositionHeight={dimensions.height}
          fps={FPS}
          controls
          style={{
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
}
