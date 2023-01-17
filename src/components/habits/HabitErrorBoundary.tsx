import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { trpc } from '../../utils/trpc';
import { Spinner } from '../general/Spinner';

const ErrorFallback = () => {
  const utils = trpc.useContext();
    return (
      <div
        className="text-red-500 border border-red-500 w-full h-full flex flex-col justify-center items-center"
        role="alert"
      >
        <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
        <button className="mt-4" 
        onClick={() => {
          utils.refetchQueries(['habits.habit-graph'])
          utils.refetchQueries(['habits.habit-graph'])
          }
        }>
          Refresh
        </button>
      </div>
    );
  };
  

export const HabitErrorBoundary = ({ children }: {children: React.ReactNode}) => {
    return (
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
        </ErrorBoundary>
      </React.Suspense>
    );
  };
  