import Link from 'next/link'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  compact?: boolean
}

export default function JobCard({ job, compact = false }: JobCardProps) {
  const salaryLabel = job.salary_min && job.salary_max
    ? `HKD ${(job.salary_min / 1000).toFixed(0)}K – ${(job.salary_max / 1000).toFixed(0)}K/mo`
    : job.salary_min
    ? `HKD ${(job.salary_min / 1000).toFixed(0)}K+/mo`
    : 'Salary negotiable'

  const employmentLabel: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    'contract': 'Contract',
    'freelance': 'Freelance',
  }

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  const postedLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`

  return (
    <Link href={`/jobs/${job.id}`} className="card block p-5 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company logo placeholder */}
          <div className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-bold text-sm">
              {(job.company_name || 'Co').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                {job.title}
              </h3>
              {job.featured && (
                <span className="badge bg-amber-100 text-amber-700 flex-shrink-0">Featured</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{job.company_name || 'Company'}</p>
            {!compact && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{job.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {salaryLabel}
        </span>
        <span className="badge bg-blue-50 text-blue-700">
          {employmentLabel[job.employment_type] || job.employment_type}
        </span>
        <span className="badge bg-gray-100 text-gray-600">
          {job.category}
        </span>
        <span className="ml-auto text-xs text-gray-400">{postedLabel}</span>
      </div>
    </Link>
  )
}
