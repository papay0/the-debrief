"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { PostMetadata } from "@/lib/posts";
import { Sparkles } from "lucide-react";
import type { Scene, SceneAudio, ArticleVideoProps } from "@/remotion/schemas";
import type { SlideData } from "./components/slide-renderer";
import {
  SlideRenderer,
  SLIDE_BG,
  VideoCoverSquare,
  VideoCoverVertical,
} from "./components/slide-renderer";
import { ArticleSelector } from "./components/article-selector";
import { ContentEditor } from "./components/content-editor";
import { CarouselSection } from "./components/carousel-section";
import { VideoSection } from "./components/video-section";
import { CaptionSection } from "./components/caption-section";
import {
  PostingStrategySection,
  type PostingStep,
} from "./components/posting-strategy-section";
import { FullscreenCarousel } from "./components/fullscreen-carousel";

interface GeneratedSlide {
  heading: string;
  bullets: string[];
  narration: string;
}

type Format = "square" | "vertical";

export function ContentGenerator({ posts }: { posts: PostMetadata[] }) {
  // --- State ---
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [exporting, setExporting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [format, setFormat] = useState<Format>("square");
  const [ttsLoading, setTtsLoading] = useState(false);
  const [renderingFormat, setRenderingFormat] = useState<string | null>(null);

  // Unified generated data
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[]>([]);
  const [titleNarration, setTitleNarration] = useState("");
  const [ctaNarration, setCtaNarration] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [caption, setCaption] = useState("");
  const [postingStrategy, setPostingStrategy] = useState<PostingStep[]>([]);

  // Article metadata for title slide
  const [articleTitle, setArticleTitle] = useState("");
  const [articleKeyword, setArticleKeyword] = useState("");
  const [articleDescription, setArticleDescription] = useState("");
  const [articleTags, setArticleTags] = useState<string[]>([]);

  // Audio state per scene (indexed same as videoScenes)
  const [sceneAudio, setSceneAudio] = useState<(SceneAudio | undefined)[]>([]);

  const slidesRef = useRef<HTMLDivElement>(null);
  const coversRef = useRef<HTMLDivElement>(null);

  const selectedPost = posts.find((p) => p.slug === selectedSlug);

  // --- Derived: carousel slides (for PNG export / visual preview) ---
  const carouselSlides: SlideData[] = useMemo(() => {
    if (generatedSlides.length === 0) return [];
    const totalSlides = generatedSlides.length + 2;
    const all: SlideData[] = [];

    all.push({
      type: "title",
      title: articleTitle,
      keyword: articleKeyword,
      description: articleDescription,
      tags: articleTags,
    });

    generatedSlides.forEach((s, i) => {
      all.push({
        type: "content",
        heading: s.heading,
        bullets: s.bullets,
        slideNumber: i + 2,
        totalSlides,
      });
    });

    all.push({
      type: "cta",
      slideNumber: totalSlides,
      totalSlides,
    });

    return all;
  }, [generatedSlides, articleTitle, articleKeyword, articleDescription, articleTags]);

  // --- Derived: video scenes (for Remotion player) ---
  const videoScenes: Scene[] = useMemo(() => {
    if (generatedSlides.length === 0) return [];
    const totalSlides = generatedSlides.length + 2;
    const scenes: Scene[] = [];

    scenes.push({
      type: "title" as const,
      title: articleTitle,
      keyword: articleKeyword,
      description: articleDescription,
      tags: articleTags.slice(0, 3),
      narration: titleNarration,
      audio: sceneAudio[0],
    });

    generatedSlides.forEach((s, i) => {
      scenes.push({
        type: "content" as const,
        heading: s.heading,
        bullets: s.bullets,
        slideNumber: i + 2,
        totalSlides,
        narration: s.narration,
        audio: sceneAudio[i + 1],
      });
    });

    scenes.push({
      type: "cta" as const,
      slideNumber: totalSlides,
      totalSlides,
      narration: ctaNarration,
      audio: sceneAudio[generatedSlides.length + 1],
    });

    return scenes;
  }, [
    generatedSlides,
    articleTitle,
    articleKeyword,
    articleDescription,
    articleTags,
    titleNarration,
    ctaNarration,
    sceneAudio,
  ]);

  // For vertical/reel format, use only 2 of 3 content scenes (title + 2 content + CTA = 4 scenes, ~25-35 sec)
  // Square format keeps all 3 content scenes
  const activeVideoScenes: Scene[] = useMemo(() => {
    if (videoScenes.length === 0) return [];
    if (format === "square") return videoScenes;

    // For vertical: title + first 2 content scenes + CTA
    const title = videoScenes.filter((s) => s.type === "title");
    const content = videoScenes.filter((s) => s.type === "content").slice(0, 2);
    const cta = videoScenes.filter((s) => s.type === "cta");
    const filtered = [...title, ...content, ...cta];

    // Recalculate slideNumber/totalSlides for the filtered set
    const totalSlides = filtered.length;
    return filtered.map((scene, i) => {
      if (scene.type === "content") {
        return { ...scene, slideNumber: i + 1, totalSlides };
      }
      if (scene.type === "cta") {
        return { ...scene, slideNumber: totalSlides, totalSlides };
      }
      return scene;
    });
  }, [videoScenes, format]);

  const videoProps: ArticleVideoProps = useMemo(
    () => ({ scenes: activeVideoScenes, format }),
    [activeVideoScenes, format]
  );

  const hasAudio = sceneAudio.some((a) => a !== undefined);
  const hasContent = generatedSlides.length > 0;

  // --- Callbacks ---

  const generateAudioForScenes = useCallback(
    async (scenes: { narration?: string }[]) => {
      // Each generation gets a unique ID so audio URLs are never stale
      const sessionId = Date.now().toString(36);
      const newAudio: (SceneAudio | undefined)[] = [];

      // Clean up previous audio files first
      await fetch("/api/admin/audio/cleanup", { method: "POST" });

      for (let i = 0; i < scenes.length; i++) {
        const narration = scenes[i].narration;
        if (!narration) {
          newAudio.push(undefined);
          continue;
        }

        setLoadingStep(
          `Generating audio ${i + 1}/${scenes.length}...`
        );

        const res = await fetch("/api/admin/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: narration,
            sceneId: `${sessionId}-scene-${i}`,
            voice: "af_heart",
            speed: 0.95,
            language: "en-us",
          }),
        });

        const data = await res.json();
        if (data.error) {
          console.error(`TTS failed for scene ${i}:`, data.error);
          newAudio.push(undefined);
          continue;
        }

        newAudio.push(data as SceneAudio);
      }

      return newAudio;
    },
    []
  );

  const generate = useCallback(
    async (slug: string) => {
      setLoading(true);
      setLoadingStep("Fetching article...");
      setGeneratedSlides([]);
      setArticleKeyword("");
      setTitleNarration("");
      setCtaNarration("");
      setHashtags("");
      setCaption("");
      setPostingStrategy([]);
      setSceneAudio([]);

      try {
        const res = await fetch(`/api/admin/articles/${slug}`);
        const post = await res.json();

        setArticleTitle(post.title);
        setArticleDescription(post.description);
        setArticleTags(post.tags || []);

        setLoadingStep("Generating content with AI...");
        const aiRes = await fetch("/api/admin/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: post.title,
            description: post.description,
            tags: post.tags,
            content: post.content,
            date: post.date,
          }),
        });

        const data = await aiRes.json();
        if (data.error) {
          console.error("Generation failed:", data.error);
          return;
        }

        const slides: GeneratedSlide[] = data.slides || [];
        const tNarration: string = data.titleNarration || "";
        const cNarration: string = data.ctaNarration || "";

        setGeneratedSlides(slides);
        setArticleKeyword(data.hook || data.keyword || post.tags?.[0] || "");
        setTitleNarration(tNarration);
        setCtaNarration(cNarration);
        setHashtags(data.hashtags || "");
        setCaption(
          data.instagramCaption ||
            `Read the full article at the-debrief.ai (link in bio)\n\n${data.hashtags || ""}`
        );
        setPostingStrategy(data.postingStrategy || []);

        // Automatically generate TTS audio for all scenes
        setLoadingStep("Generating narration audio...");
        const allScenes = [
          { narration: tNarration },
          ...slides.map((s) => ({ narration: s.narration })),
          { narration: cNarration },
        ];

        const audioResults = await generateAudioForScenes(allScenes);
        setSceneAudio(audioResults);
      } catch (err) {
        console.error("Failed to generate:", err);
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    },
    [generateAudioForScenes]
  );

  const handleSelectArticle = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      generate(slug);
    },
    [generate]
  );

  const handleRegenerate = useCallback(() => {
    if (selectedSlug) generate(selectedSlug);
  }, [selectedSlug, generate]);

  const updateCarouselSlide = useCallback(
    (index: number, patch: Partial<SlideData>) => {
      // Title slide (index 0): update article metadata
      if (index === 0) {
        if (patch.title !== undefined) setArticleTitle(patch.title);
        if (patch.keyword !== undefined) setArticleKeyword(patch.keyword);
        if (patch.description !== undefined)
          setArticleDescription(patch.description);
        if (patch.tags !== undefined) setArticleTags(patch.tags);
      }
      // Content slides (index 1..N): update generatedSlides
      // This is handled by onUpdateGenerated in ContentEditor
    },
    []
  );

  const updateGenerated = useCallback(
    (index: number, patch: Partial<GeneratedSlide>) => {
      setGeneratedSlides((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
      );
    },
    []
  );

  // --- PNG export ---

  const downloadSlide = useCallback(async (index: number) => {
    const container = slidesRef.current;
    if (!container) return;
    const slideEl = container.children[index] as HTMLElement;
    if (!slideEl) return;

    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(slideEl, {
      width: 1080,
      height: 1080,
      scale: 1,
      useCORS: true,
      backgroundColor: index === 0 ? "#0A0A0F" : SLIDE_BG,
    });

    const link = document.createElement("a");
    link.download = `slide-${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const downloadAll = useCallback(async () => {
    setExporting(true);
    const container = slidesRef.current;
    if (!container) return;

    const html2canvas = (await import("html2canvas-pro")).default;

    for (let i = 0; i < container.children.length; i++) {
      const slideEl = container.children[i] as HTMLElement;
      const canvas = await html2canvas(slideEl, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        backgroundColor: i === 0 ? "#0A0A0F" : SLIDE_BG,
      });

      const link = document.createElement("a");
      link.download = `slide-${i + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      await new Promise((r) => setTimeout(r, 300));
    }

    setExporting(false);
  }, []);

  // --- Cover image export ---

  const downloadCover = useCallback(async (fmt: "square" | "vertical") => {
    const container = coversRef.current;
    if (!container) return;

    const isSquare = fmt === "square";
    const index = isSquare ? 0 : 1;
    const coverEl = container.children[index] as HTMLElement;
    if (!coverEl) return;

    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(coverEl, {
      width: 1080,
      height: isSquare ? 1080 : 1920,
      scale: 1,
      useCORS: true,
      backgroundColor: "#0A0A0F",
    });

    const link = document.createElement("a");
    link.download = `cover-${isSquare ? "1x1" : "9x16"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  // --- TTS (regenerate) ---

  const regenerateTTS = useCallback(async () => {
    if (videoScenes.length === 0) return;
    setTtsLoading(true);
    setLoadingStep("Regenerating narration audio...");

    try {
      const audioResults = await generateAudioForScenes(
        videoScenes.map((s) => ({ narration: s.narration }))
      );
      setSceneAudio(audioResults);
    } catch (err) {
      console.error("TTS generation failed:", err);
    } finally {
      setTtsLoading(false);
      setLoadingStep("");
    }
  }, [videoScenes, generateAudioForScenes]);

  // --- Video render ---

  const renderSingleVideo = useCallback(
    async (fmt: "square" | "vertical") => {
      // For vertical, filter to only 2 content scenes (same logic as activeVideoScenes)
      let scenesForRender = videoScenes;
      if (fmt === "vertical" && videoScenes.length > 0) {
        const title = videoScenes.filter((s) => s.type === "title");
        const content = videoScenes
          .filter((s) => s.type === "content")
          .slice(0, 2);
        const cta = videoScenes.filter((s) => s.type === "cta");
        const filtered = [...title, ...content, ...cta];
        const totalSlides = filtered.length;
        scenesForRender = filtered.map((scene, i) => {
          if (scene.type === "content") {
            return { ...scene, slideNumber: i + 1, totalSlides };
          }
          if (scene.type === "cta") {
            return { ...scene, slideNumber: totalSlides, totalSlides };
          }
          return scene;
        });
      }

      const res = await fetch("/api/admin/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          props: { scenes: scenesForRender, format: fmt },
          format: fmt,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${fmt === "square" ? "1x1" : "9x16"}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [videoScenes]
  );

  const renderVideo = useCallback(
    async (renderFormat: "square" | "vertical" | "both") => {
      setRenderingFormat(renderFormat);
      try {
        if (renderFormat === "both") {
          await renderSingleVideo("square");
          await renderSingleVideo("vertical");
        } else {
          await renderSingleVideo(renderFormat);
        }
      } catch (err) {
        console.error("Render failed:", err);
      } finally {
        setRenderingFormat(null);
      }
    },
    [renderSingleVideo]
  );

  // --- Render ---

  return (
    <div>
      {/* Article selector */}
      <div className="mb-8">
        <ArticleSelector
          posts={posts}
          selectedSlug={selectedSlug}
          onSelect={handleSelectArticle}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground py-20">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm">{loadingStep}</span>
        </div>
      )}

      {/* Main content */}
      {!loading && hasContent && (
        <div className="space-y-10">
          {/* Content Editor */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold font-serif text-foreground">
                Edit Content
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                {carouselSlides.length} slides
              </span>
            </div>
            <ContentEditor
              slides={carouselSlides}
              generatedSlides={generatedSlides}
              titleNarration={titleNarration}
              ctaNarration={ctaNarration}
              onUpdateSlide={updateCarouselSlide}
              onUpdateGenerated={updateGenerated}
              onUpdateTitleNarration={setTitleNarration}
              onUpdateCtaNarration={setCtaNarration}
            />
          </section>

          {/* Carousel */}
          <CarouselSection
            slides={carouselSlides}
            exporting={exporting}
            onFullscreen={() => setFullscreen(true)}
            onRegenerate={handleRegenerate}
            onDownloadAll={downloadAll}
            onDownloadSlide={downloadSlide}
          />

          {/* Video */}
          <VideoSection
            videoProps={videoProps}
            format={format}
            hasAudio={hasAudio}
            ttsLoading={ttsLoading}
            renderingFormat={renderingFormat}
            onFormatChange={setFormat}
            onRegenerateTTS={regenerateTTS}
            onRenderVideo={renderVideo}
            onDownloadCover={downloadCover}
          />

          {/* Caption & Hashtags */}
          <CaptionSection
            caption={caption}
            hashtags={hashtags}
            onCaptionChange={setCaption}
            onHashtagsChange={setHashtags}
          />

          {/* Posting Strategy */}
          {postingStrategy.length > 0 && (
            <PostingStrategySection steps={postingStrategy} />
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasContent && !selectedSlug && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg">
          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Select an article above to generate content for Instagram and video.
          </p>
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <FullscreenCarousel
          slides={carouselSlides}
          onClose={() => setFullscreen(false)}
        />
      )}

      {/* Hidden full-size slides for PNG export */}
      <div
        ref={slidesRef}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        {carouselSlides.map((slide, i) => (
          <div key={i}>
            <SlideRenderer slide={slide} />
          </div>
        ))}
      </div>

      {/* Hidden cover images for PNG export */}
      <div
        ref={coversRef}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        <div>
          <VideoCoverSquare keyword={articleKeyword} />
        </div>
        <div>
          <VideoCoverVertical keyword={articleKeyword} />
        </div>
      </div>
    </div>
  );
}
