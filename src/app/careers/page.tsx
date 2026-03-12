'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { articlesApi } from '@/lib/api'
import type { Article } from '@/types'

const MOCK_ARTICLES: Article[] = [
  { id: 1, title: '10 Tips for Acing Your Job Interview in HK', slug: 'interview-tips', body: '', status: 'published', published_at: new Date().toISOString() },
  { id: 2, title: 'Hong Kong Salary Trends 2026: What You Need to Know', slug: 'salary-trends-2026', body: '', status: 'published', published_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 3, title: 'How to Write a CV That Stands Out', slug: 'cv-writing-guide', body: '', status: 'published', published_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 4, title: 'Top In-Demand Skills in HK Finance Sector', slug: 'finance-skills-2026', body: '', status: 'published', published_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 5, title: 'Remote Work in Hong Kong: Opportunities & Challenges', slug: 'remote-work-hk', body: '', status: 'published', published_at: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: 6, title: 'Tech Career Paths in Hong Kong\'s Fintech Boom', slug: 'fintech-career-paths', body: '', status: 'published', published_at: new Date(Date.now() - 86400000 * 20).toISOString() },
]

export default function CareersPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    articlesApi.list()
      .then(r => setArticles(r.articles?.length ? r.articles : MOCK_ARTICLES))
      .catch(() => setArticles(MOCK_ARTICLES))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Career Advice</h1>
        <p className="text-gray-500 mt-2">Insights and tips to advance your career in Hong Kong</p>
      </div>

      {/* Featured article */}
      {articles[0] && (
        <div className="card p-8 mb-8 bg-gradient-to-br from-primary-800 to-primary-900 text-white border-0">
          <span className="badge bg-white/20 text-white mb-3">Featured</span>
          <h2 className="text-2xl font-bold mb-3">{articles[0].title}</h2>
          <p className="text-primary-200 text-sm mb-4">
            {new Date(articles[0].published_at || '').toLocaleDateString('en-HK', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <Link href={`/careers/${articles[0].slug}`}
            className="inline-flex items-center gap-2 bg-white text-primary-800 font-medium px-5 py-2.5 rounded-lg hover:bg-primary-50 transition-colors text-sm">
            Read Article →
          </Link>
        </div>
      )}

      {/* Article grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.slice(1).map(article => (
            <Link key={article.id} href={`/careers/${article.slug}`} className="card p-5 group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug mb-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-400">
                {new Date(article.published_at || '').toLocaleDateString('en-HK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
