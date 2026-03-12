'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import JobCard from '@/components/JobCard'
import { jobsApi } from '@/lib/api'
import type { Job } from '@/types'
import { JOB_CATEGORIES } from '@/types'

const CATEGORY_ICONS: Record<string, string> = {
  'IT & Technology': '💻',
  'Finance & Banking': '💼',
  'Sales & Marketing': '📈',
  'HR & Admin': '👥',
  'Engineering': '⚙️',
  'Healthcare': '🏥',
  'Education': '📚',
  'Hospitality': '🍽️',
  'Legal': '⚖️',
  'Retail': '🛍️',
  'Construction': '🏗️',
  'Logistics': '🚚',
}

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsApi.featured()
      .then(r => setFeaturedJobs(r.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Next Job<br />in Hong Kong
          </h1>
          <p className="text-primary-200 text-lg mb-8">
            Over 50,000 jobs from Hong Kong&apos;s top employers
          </p>
          <SearchBar className="max-w-3xl mx-auto" />
          <div className="mt-4 flex items-center justify-center gap-4 text-primary-300 text-sm">
            <span>Popular:</span>
            {['Software Engineer', 'Financial Analyst', 'Marketing Manager', 'Nurse'].map(term => (
              <Link key={term} href={`/jobs?q=${encodeURIComponent(term)}`}
                className="hover:text-white transition-colors underline underline-offset-2">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '50,000+', label: 'Active Jobs' },
            { num: '10,000+', label: 'Companies' },
            { num: '500,000+', label: 'Candidates' },
            { num: '98%', label: 'Satisfaction Rate' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary-700">{stat.num}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-500 mb-8">Explore opportunities across all industries</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {JOB_CATEGORIES.map(cat => (
              <Link key={cat} href={`/jobs?category=${encodeURIComponent(cat)}`}
                className="card p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-all group">
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat] || '💼'}</div>
                <p className="text-xs font-medium text-gray-700 group-hover:text-primary-700">{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-500 mt-1">Top opportunities from premium employers</p>
            </div>
            <Link href="/jobs" className="btn-secondary">View all jobs →</Link>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid gap-4">
              {featuredJobs.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            // Fallback mock data when API is not yet connected
            <div className="grid gap-4">
              {MOCK_JOBS.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA for Employers */}
      <section className="bg-primary-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hiring in Hong Kong?</h2>
          <p className="text-primary-200 mb-8">
            Reach over 500,000 active job seekers. Post your first job today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/register" className="bg-white text-primary-800 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              Post a Job
            </Link>
            <Link href="/employer" className="border border-primary-400 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const MOCK_JOBS: Job[] = [
  {
    id: 1, employer_id: 1, title: 'Senior Software Engineer', company_name: 'HSBC Hong Kong',
    description: 'Join our digital banking team to build next-generation financial services applications.',
    category: 'IT & Technology', location: 'Central', salary_min: 50000, salary_max: 80000,
    employment_type: 'full-time', status: 'active', featured: true, created_at: new Date().toISOString(),
  },
  {
    id: 2, employer_id: 2, title: 'Financial Analyst', company_name: 'Goldman Sachs',
    description: 'Analyse market trends and provide investment recommendations for Asia Pacific clients.',
    category: 'Finance & Banking', location: 'Central', salary_min: 45000, salary_max: 70000,
    employment_type: 'full-time', status: 'active', featured: true, created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3, employer_id: 3, title: 'Marketing Manager', company_name: 'CLP Power',
    description: 'Lead digital marketing campaigns and drive brand awareness across Hong Kong and Macau.',
    category: 'Sales & Marketing', location: 'Kowloon Bay', salary_min: 35000, salary_max: 55000,
    employment_type: 'full-time', status: 'active', featured: false, created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]
