import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password: process.env.NEXT_SECRET_COOKIE_PASSWORD || '',
  cookieName: 'secondoor@session',
  cookieOptions: {
    // the next line allows to use the session in non-https environments like
    // Next.js dev mode (http://localhost:3000)
    secure: process.env.NODE_ENV === 'production',
  },
}

export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export default function withSession(handler: any) { // eslint-disable-line
  return withIronSessionSsr(handler, sessionOptions);
}
