import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-white font-bold">Recruit.com.hk</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hong Kong&apos;s leading job platform connecting top talent with great employers.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Career Advice</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/employer/jobs/new" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/employer" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link href="/employer/pipeline" className="hover:text-white transition-colors">Candidate Pipeline</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-xs text-gray-600 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2026 Recruit.com.hk. All rights reserved.</p>
          <p>Proudly serving Hong Kong since 1998</p>
        </div>
      </div>
    </footer>
  )
}
