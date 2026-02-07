import { getAllPosts, getAllTags } from "@/lib/posts"
import { ArticleList } from "@/components/article-list"
import { TagFilter } from "@/components/tag-filter"

export default function Home() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <TagFilter tags={tags} />
      <div className="mt-6">
        <ArticleList posts={posts} />
      </div>
    </div>
  )
}
