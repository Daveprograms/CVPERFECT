'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/config';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload a PDF or Word document.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }

      if (!jobDescription.trim()) {
        toast.error('Please provide a job description.');
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze resume');
        }

        const data = await response.json();
        toast.success('Resume analyzed successfully!');
        router.push(`/dashboard/history/${data.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to analyze resume');
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome back, {user?.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your resume and paste a job description to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-white dark:bg-gray-800 shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Upload Resume
            </h3>
            <div
              {...getRootProps()}
              className={`mt-4 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 ${
                isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="text-center">
                <DocumentTextIcon
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <input {...getInputProps()} />
                  <span className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                  PDF or Word up to 5MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg bg-white dark:bg-gray-800 shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Job Description
            </h3>
            <div className="mt-4">
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-lg bg-white dark:bg-gray-800 shadow"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Your Plan
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-5 shadow-sm">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.isPro ? 'Pro Plan' : 'Basic Plan'}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user?.isPro
                      ? 'Unlimited resume analyses'
                      : `${user?.credits || 0} credits remaining`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 