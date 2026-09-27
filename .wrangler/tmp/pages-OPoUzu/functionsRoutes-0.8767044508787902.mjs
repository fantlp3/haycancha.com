import { onRequestPost as __api_submit_club_ts_onRequestPost } from "/sessions/rcw-01qsgjfwt56ffjzargkryyho/mnt/haycancha.com/functions/api/submit-club.ts"
import { onRequest as ___middleware_ts_onRequest } from "/sessions/rcw-01qsgjfwt56ffjzargkryyho/mnt/haycancha.com/functions/_middleware.ts"

export const routes = [
    {
      routePath: "/api/submit-club",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_submit_club_ts_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]