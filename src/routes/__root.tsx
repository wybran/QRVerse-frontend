import { ModeToggle } from '@/components/mode-toggle';
import { ME } from '@/config/URLS';
import LoadingPage from '@/pages/LoadingPage';
import NotFound from '@/pages/NotFound';
import { Axios, redirectToGoogleLogin } from '@/utils/Axios';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  loader: async ({ location }) => {
    const user = localStorage.getItem('user');
    const isRootPath =
      location.pathname === '/' || location.pathname.startsWith('/redirect');

    if (!user && !isRootPath) {
      const response = await Axios.get(ME());
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
      } else if (response.status === 401) {
        redirectToGoogleLogin();
      }
    }
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  pendingComponent: LoadingPage
});

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          Account
        </Link>
        <ModeToggle />
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
