import { ModeToggle } from '@/components/mode-toggle';
import { ME } from '@/config/URLS';
import LoadingPage from '@/pages/LoadingPage';
import NotFound from '@/pages/NotFound';
import { Axios, redirectToGoogleLogin } from '@/utils/Axios';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createRootRoute({
  loader: async ({ location }) => {
    const user = localStorage.getItem('user');
    const isRootPath =
      location.pathname === '/' || location.pathname.startsWith('/redirect');

    if (!user && !isRootPath) {
      try {
        const response = await Axios.get(ME());
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.data));
        } else if (response.status === 401) {
          redirectToGoogleLogin();
        }
      } catch (error) {
        redirectToGoogleLogin();
      }
    }
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  pendingComponent: LoadingPage
});

function RootComponent() {
  const { t } = useTranslation();
  return (
    <>
      <nav className="text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-6">
            <Link
              to="/"
              className="hover:text-blue-400 transition duration-200 [&.active]:font-bold">
              QR Code Generator
            </Link>
            <Link
              to="/account"
              className="hover:text-blue-400 transition duration-200 [&.active]:font-bold">
              {t('Account')}
            </Link>
          </div>

          <div>
            <ModeToggle />
          </div>
        </div>
      </nav>
      <hr />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
