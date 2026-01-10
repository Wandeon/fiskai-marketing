"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { GlassCard } from "@/components/shared/ui/patterns/GlassCard"
import { Button } from "@/components/shared/ui/button"
import { PostCard } from "./PostCard"
import { useDebouncedCallback } from "use-debounce"
import Fuse from "fuse.js"

interface SearchResult {
  id: string
  slug: string
  title: string
  excerpt: string | null
  categoryName: string | null
  categorySlug: string | null
  publishedAt: string | null
  impactLevel: string | null
}

interface NewsPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  publishedAt: string
  categoryName: string | null
  categorySlug: string | null
  tags: string[]
  impactLevel: string | null
  tldr: string | null
}

interface NewsSearchProps {
  initialQuery?: string
  posts?: NewsPost[]
}

export function NewsSearch({ initialQuery = "", posts = [] }: NewsSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(!!initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Fuse.js search engine
  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.2 },
        { name: "content", weight: 0.2 },
        { name: "tags", weight: 0.1 },
        { name: "tldr", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    })
  }, [posts])

  const performSearch = useDebouncedCallback((searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const searchResults = fuse.search(searchQuery, { limit: 10 })
      const mappedResults: SearchResult[] = searchResults.map((result) => ({
        id: result.item.id,
        slug: result.item.slug,
        title: result.item.title,
        excerpt: result.item.excerpt,
        categoryName: result.item.categoryName,
        categorySlug: result.item.categorySlug,
        publishedAt: result.item.publishedAt,
        impactLevel: result.item.impactLevel,
      }))
      setResults(mappedResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, 150)

  useEffect(() => {
    if (query) {
      void performSearch(query)
    }
  }, [query, performSearch])

  const handleOpenSearch = () => {
    setIsOpen(true)
  }

  const handleCloseSearch = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    // Remove query param from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    router.push(`/vijesti${params.toString() ? `?${params}` : ""}`)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }
    router.replace(`/vijesti?${params}`, { scroll: false })
  }

  if (!isOpen) {
    return (
      <Button variant="secondary" size="sm" onClick={handleOpenSearch}>
        <Search className="h-4 w-4" />
        Pretraži
      </Button>
    )
  }

  return (
    <div className="w-full">
      {/* Search Input */}
      <GlassCard hover={false} padding="sm" className="mb-4">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-white/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Pretraži vijesti..."
            className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
            autoFocus
          />
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
          <button
            onClick={handleCloseSearch}
            className="rounded-lg p-2 text-white/50 hover:bg-surface/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </GlassCard>

      {/* Search Results */}
      {query.length >= 2 && (
        <div className="mb-8">
          <p className="mb-4 text-sm text-white/60">
            {isLoading ? (
              "Pretraživanje..."
            ) : results.length > 0 ? (
              <>
                Pronađeno <strong className="text-white">{results.length}</strong> rezultata za &quot;
                {query}&quot;
              </>
            ) : (
              <>Nema rezultata za &quot;{query}&quot;</>
            )}
          </p>

          {/* Published posts */}
          {results.length > 0 && (
            <div className="mb-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => (
                  <PostCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    categoryName={post.categoryName || undefined}
                    categorySlug={post.categorySlug || undefined}
                    publishedAt={post.publishedAt ? new Date(post.publishedAt) : new Date()}
                    impactLevel={post.impactLevel}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
