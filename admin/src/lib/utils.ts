import { authService } from '@services/auth.service';
import moment from 'moment';
import Router from 'next/router';

export function isUrl(url: string): boolean {
  return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g) !== null;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function redirectLogin(ctx) {
  if (typeof window !== 'undefined') {
    authService.removeToken();
    Router.push('/login');
    return;
  }

  ctx.res.clearCookie && ctx.res.clearCookie('token');
  ctx.res.clearCookie && ctx.res.clearCookie('role');
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/login' });
  ctx.res.end && ctx.res.end();
}

export function formatDate(date, format = 'DD/MM/YYYY HH:mm') {
  return moment(date).format(format);
}
