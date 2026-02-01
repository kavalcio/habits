import * as R from 'ramda';

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

export const Routes = R.mapObjIndexed((route) => route.PATH, RoutesConfig);

export const AuthenticatedRoutes = R.pipe(
  R.filter((route: RouteType) => route.IS_AUTHENTICATED),
  R.mapObjIndexed((route: RouteType) => route.PATH),
)(RoutesConfig);
