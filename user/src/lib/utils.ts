import { authService } from '@services/auth.service';
import { toast } from 'react-toastify';

export function isUrl(url: string): boolean {
  return (
    url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)
    !== null
  );
}

// https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
export function updateQueryStringParameter(uri: string, key: string, value: string) {
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
}

export const basicStore = {
  success: false,
  requesting: false,
  error: null
};

export function redirect404(ctx = null) {
  if (typeof window !== 'undefined') {
    window.location.href = '/404';
    return;
  }

  if (!ctx) return;

  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/404' });
  ctx.res.end && ctx.res.end();
}

export function redirect(location: string, ctx = null) {
  if (typeof window !== 'undefined') {
    window.location.href = location;
  }

  ctx.res.writeHead && ctx.res.writeHead(302, { Location: location });
  ctx.res.end && ctx.res.end();
}

export function redirectLogin(ctx) {
  if (typeof window !== 'undefined') {
    authService.removeToken();
    window.location.href = '/auth/login';
    return;
  }

  ctx.res.clearCookie && ctx.res.clearCookie('token');
  ctx.res.clearCookie && ctx.res.clearCookie('role');
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/auth/login' });
  ctx.res.end && ctx.res.end();
}

export function formatNumber(number: number | string) {
  if (!number) return '0.00';

  return Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export async function showError(e, defaultErrMsg = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut!') {
  const err = await e;
  toast.error(err.msg || defaultErrMsg);
}
