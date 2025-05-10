import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { DocumentTextIcon, ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ResumeHistory {
  id: string;
  date: string;
  originalFileName: string;
  jobDescription: string;
  score: number;
  improvements: string[];
  learningPlan?: string;
  enhancedResumeUrl?: string;
}

// Mock data - replace with actual API call
const mockHistory: ResumeHistory[] = [
  {
    id: '1',
    date: '2024-03-15',
    originalFileName: 'resume.pdf',
    jobDescription: 'Senior Frontend Developer position at Tech Corp...',
    score: 8,
    improvements: [
      'Added missing keywords: "React", "TypeScript", "Node.js"',
      'Enhanced project descriptions with quantifiable achievements',
      'Improved skills section organization'
    ],
    learningPlan: 'Consider taking advanced courses in React and TypeScript',
    enhancedResumeUrl: '/api/resumes/enhanced/1'
  },
  {
    id: '2',
    date: '2024-03-10',
    originalFileName: 'my_resume.docx',
    jobDescription: 'Full Stack Developer role at Startup Inc...',
    score: 7,
    improvements: [
      'Added missing keywords: "AWS", "Docker", "CI/CD"',
      'Restructured work experience to highlight relevant achievements',
      'Updated skills section to match job requirements'
    ]
  }
];

export default function History() {
  const { user } = useAuthStore();
  const [selectedResume, setSelectedResume] = useState<ResumeHistory | null>(null);

  const handleDownload = async (resume: ResumeHistory) => {
    if (!user?.isProUser) {
      window.location.href = '/dashboard/billing';
      return;
    }

    try {
      // TODO: Implement actual download
      console.log('Downloading enhanced resume:', resume.id);
      // const response = await fetch(resume.enhancedResumeUrl);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `enhanced_${resume.originalFileName}`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Resume History
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your past resume analyses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockHistory.map((resume, index) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {resume.originalFileName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analyzed on {new Date(resume.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {resume.score}/10
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(resume)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    {user?.isProUser ? 'Download' : 'Upgrade to Download'}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Job Description
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {resume.jobDescription}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Improvements Made
                </h4>
                <ul className="space-y-2">
                  {resume.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        {improvement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {resume.learningPlan && user?.isProUser && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Learning Recommendation
                  </h4>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    {resume.learningPlan}
                  </p>
                </div>
              )}

              {!user?.isProUser && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Upgrade to Pro to see detailed learning recommendations and download your enhanced resume.
                  </p>
                  <button
                    onClick={() => window.location.href = '/dashboard/billing'}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Upgrade Now →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {mockHistory.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resume history</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by analyzing your first resume.
          </p>
          <div className="mt-6">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Analyze Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 