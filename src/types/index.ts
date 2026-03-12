export interface User {
  id: number
  email: string
  role: 'candidate' | 'employer' | 'admin'
}

export interface Job {
  id: number
  employer_id: number
  title: string
  description: string
  category: string
  location: string
  salary_min?: number
  salary_max?: number
  employment_type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  status: 'active' | 'closed' | 'draft'
  featured: boolean
  created_at: string
  expires_at?: string
  company_name?: string
  company_logo?: string
}

export interface Application {
  id: number
  job_id: number
  candidate_id: number
  status: 'submitted' | 'viewed' | 'interview' | 'hired' | 'rejected'
  applied_at: string
  job?: Job
}

export interface CandidateProfile {
  user_id: number
  full_name: string
  phone?: string
  location?: string
  summary?: string
  skills?: string[]
  experience_years?: number
  expected_salary?: number
}

export interface EmployerProfile {
  user_id: number
  company_name: string
  company_logo?: string
  industry?: string
  description?: string
  website?: string
}

export interface Article {
  id: number
  title: string
  slug: string
  body: string
  status: 'draft' | 'published'
  published_at?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export const JOB_CATEGORIES = [
  'IT & Technology',
  'Finance & Banking',
  'Sales & Marketing',
  'HR & Admin',
  'Engineering',
  'Healthcare',
  'Education',
  'Hospitality',
  'Legal',
  'Retail',
  'Construction',
  'Logistics',
]

export const HK_LOCATIONS = [
  'Central',
  'Wan Chai',
  'Causeway Bay',
  'Tsim Sha Tsui',
  'Mong Kok',
  'Kwun Tong',
  'Sha Tin',
  'Tuen Mun',
  'Yuen Long',
  'Kowloon Bay',
  'Quarry Bay',
  'North Point',
]

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]
