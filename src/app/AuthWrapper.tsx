import { useEffect, useMemo, useState } from 'react';
import {
  matchPath,
  SessionData,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { AuthenticatedRoutes, Routes } from '@/constants';
import { supabase } from '@/requests';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [session, setSession] = useState<{
    initialized: boolean;
    data: SessionData | null;
  }>({
    initialized: false,
    data: null,
  });

  const isAuthenticatedRoute = useMemo(() => {
    return Object.values(AuthenticatedRoutes).some((route) =>
      matchPath(route, pathname),
    );
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: newSession } }) => {
      setSession({
        initialized: true,
        data: newSession,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession({
        initialized: true,
        data: newSession,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAllowed = session.data || !isAuthenticatedRoute;

  useEffect(() => {
    if (!isAllowed && session.initialized) {
      navigate(
        {
          pathname: Routes.LOGIN,
          // search: getRedirectSearchParams(),
        },
        { replace: true },
      );
    }
  }, [navigate, isAllowed, session.initialized]);

  if (!session.initialized) return null;

  return children;
};
