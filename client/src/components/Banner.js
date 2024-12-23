import { XMarkIcon } from '@heroicons/react/20/solid';
import { FaClock } from 'react-icons/fa'; // For adding clock icon
// import { Button } from 'shadcn';

const Banner = ({closesOn}) => {
  return (
    <div
      className="relative isolate flex flex-col items-center gap-y-4 overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6 py-4 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:gap-x-6 rounded-xl"
    >
      {/* Decorative Elements */}
      <div
        aria-hidden="true"
        className="absolute left-[-15%] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl sm:left-[-25%] md:left-[-35%] lg:left-[max(-7rem,calc(50%-52rem))]"
      >
        <div
          style={{
            clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-30 sm:w-[28rem] md:w-[20rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-[50%] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl lg:left-[max(45rem,calc(50%+8rem))]"
      >
        <div
          style={{
            clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-30 sm:w-[28rem] md:w-[20rem]"
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center gap-y-2 text-center lg:flex-row lg:items-center lg:gap-x-4 lg:text-left">
        <p className="text-base leading-6 text-white sm:text-lg dark:text-gray-300">
          <strong className="font-semibold">HURRY UP!</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline h-0.5 w-0.5 fill-current text-yellow-200"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          Fill up the tender before it closes. Tender will close on
        </p>
        <a
          href="#"
          className="mt-2 flex-none rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-0 lg:ml-4 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          {Date(closesOn)}
        </a>
      </div>

      {/* Optional Dismiss Button */}
      <div className="flex flex-1 justify-end lg:justify-start">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px] lg:hidden"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
