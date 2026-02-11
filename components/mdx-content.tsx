import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ImageGrid } from "./image-grid";

const components = {
  ImageGrid,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (props.className?.includes("anchor")) {
      return <span {...props} />;
    }
    const href = props.href || "";
    if (href.startsWith("http")) {
      return <a {...props} target="_blank" rel="noopener noreferrer" />;
    }
    return <Link {...(props as React.ComponentProps<typeof Link>)} href={href} />;
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose-debrief">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
      />
    </div>
  );
}
