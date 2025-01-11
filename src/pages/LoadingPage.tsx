import { LoaderIcon } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default LoadingPage;
