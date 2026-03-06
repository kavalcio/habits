export type RouteType = {
  PATH: string;
  NAME: string;
  IS_AUTHENTICATED: boolean;
};

export const RoutesConfig = {
  ROOT: {
    PATH: '/',
    NAME: 'Root',
    IS_AUTHENTICATED: false,
  },
  LOGIN: {
    PATH: '/login',
    NAME: 'Login',
    IS_AUTHENTICATED: false,
  },
  REGISTER: {
    PATH: '/register',
    NAME: 'Register',
    IS_AUTHENTICATED: false,
  },
  FORGOT_PASSWORD: {
    PATH: '/forgot-password',
    NAME: 'Forgot Password',
    IS_AUTHENTICATED: false,
  },
  RESET_PASSWORD: {
    PATH: '/reset-password',
    NAME: 'Reset Password',
    IS_AUTHENTICATED: false,
  },
  DASHBOARD: {
    PATH: '/dashboard',
    NAME: 'Dashboard',
    IS_AUTHENTICATED: true,
  },
  HABIT_OVERVIEW: {
    PATH: '/habit/:habitId',
    NAME: 'Habit Overview',
    IS_AUTHENTICATED: true,
  },
  PROFILE: {
    PATH: '/profile',
    NAME: 'Profile',
    IS_AUTHENTICATED: true,
  },
} satisfies Record<string, RouteType>;

export const Routes = Object.fromEntries(
  Object.entries(RoutesConfig).map(([key, route]) => [key, route.PATH]),
);

export const AuthenticatedRoutes = Object.fromEntries(
  Object.entries(RoutesConfig)
    .filter(([_, route]) => route.IS_AUTHENTICATED)
    .map(([key, route]) => [key, route.PATH]),
);
