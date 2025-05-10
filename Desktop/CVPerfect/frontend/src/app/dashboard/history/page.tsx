'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

interface Analysis {
  id: string;
  resumeName: string;
  jobDescription: string;
  score: number;
  feedback: string;
  createdAt: string;
}

export default function History() {
  const { user } = useAuthStore();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyses`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analyses');
        }

        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        toast.error('Failed to load analysis history');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchAnalyses();
    }
  }, [user?.token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Analysis History
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your past resume analyses and feedback.
        </p>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-12">
          <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No analyses yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by analyzing your resume against a job description.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {analyses.map((analysis) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden cursor-pointer ${
                selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {analysis.resumeName}
                    </h3>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysis.score >= 80
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : analysis.score >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      Score: {analysis.score}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {analysis.jobDescription}
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          onClick={() => setSelectedAnalysis(null)}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div
                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Analysis Details
                    </h3>
                    <div className="mt-4 space-y-4 text-left">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Resume Name
                        </h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedAnalysis.resumeName}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Job Description
                        </h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedAnalysis.jobDescription}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Analysis Score
                        </h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedAnalysis.score}%
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Feedback
                        </h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {selectedAnalysis.feedback}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Date
                        </h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {new Date(selectedAnalysis.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setSelectedAnalysis(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 