import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { DocumentTextIcon, ArrowUpTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ResumeAnalysis {
  score: number;
  improvements: string[];
  learningPlan?: string;
}

export default function Dashboard() {
  const { user, decrementCredits } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'application/pdf' || 
                 file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(file);
      setError(null);
    } else {
      setError('Please upload a PDF or Word document');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (!user?.isProUser && user?.remainingCredits === 0) {
      setError('You have no credits remaining. Please upgrade to continue.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // TODO: Implement resume analysis API call
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: ResumeAnalysis = {
        score: 8,
        improvements: [
          'Added missing keywords: "React", "TypeScript", "Node.js"',
          'Enhanced project descriptions with quantifiable achievements',
          'Improved skills section organization'
        ],
        learningPlan: user?.isProUser ? 'Consider taking advanced courses in React and TypeScript' : undefined
      };

      setAnalysis(mockAnalysis);
      if (!user?.isProUser) {
        decrementCredits();
      }
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Upload Section */}
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {isDragActive
                ? 'Drop your resume here'
                : 'Drag and drop your resume here, or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF, DOC, or DOCX files only
            </p>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file || !jobDescription.trim()}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <SparklesIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <SparklesIcon className="-ml-1 mr-3 h-5 w-5" />
                Analyze My Resume
              </>
            )}
          </button>

          {!user?.isProUser && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Credits remaining: {user?.remainingCredits || 0}
            </p>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Analysis Results
            </h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Score:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.score}/10
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Improvements Made:</h4>
            <ul className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{improvement}</span>
                </li>
              ))}
            </ul>

            {analysis.learningPlan && user?.isProUser && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Learning Recommendation:</h4>
                <p className="mt-2 text-blue-700 dark:text-blue-300">{analysis.learningPlan}</p>
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
      )}
    </div>
  );
} 