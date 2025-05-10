import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'AI-Powered Analysis',
    description: 'Get instant feedback on your resume with our advanced AI technology.',
    icon: SparklesIcon,
  },
  {
    name: 'Real-time Preview',
    description: 'See your changes live with our LaTeX preview system.',
    icon: DocumentTextIcon,
  },
  {
    name: 'ATS Optimization',
    description: 'Ensure your resume passes through Applicant Tracking Systems.',
    icon: ChartBarIcon,
  },
];

export default function Landing() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <motion.div 
            className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Perfect Your Resume with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Transform your career prospects with our AI-powered resume builder. Get instant feedback,
              optimize for ATS, and create a standout resume that gets you noticed.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Faster Resume Building</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to create the perfect resume
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our platform combines cutting-edge AI technology with professional resume writing expertise
            to help you stand out from the competition.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              About CVPerfect
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We're on a mission to help job seekers create resumes that get noticed. Our AI-powered
              platform analyzes your resume in real-time, providing instant feedback and suggestions
              to help you land your dream job.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  AI-Powered Analysis
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Our advanced AI technology analyzes your resume against industry standards and
                  provides personalized recommendations for improvement.
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  Real-time Preview
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                  See your changes instantly with our live LaTeX preview system. No more guessing
                  how your resume will look.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  ATS Optimization
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Ensure your resume passes through Applicant Tracking Systems with our built-in
                  optimization tools.
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  Professional Templates
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Choose from a variety of professionally designed templates that are optimized
                  for different industries and roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 