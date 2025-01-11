import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 w-screen h-screen">
      <h1 className="text-9xl dela-gothic">404</h1>
      <h4 className="text-lg dela-gothic">
        Sorry, we couldn't find what you're looking for.
      </h4>
      <Link to="/home" className="underline">
        <Button>
          Go back to <pre>/home</pre>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
