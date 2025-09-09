import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

const isProd = process.env.NODE_ENV === "production";

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd,              // only HTTPS in prod
      sameSite: "none",            //  required for cross-site cookies
      domain: "parcel-delivery-api-sigma.vercel.app", //  MUST match backend domain
      path: "/",                   //  keep consistent
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      domain: "parcel-delivery-api-sigma.vercel.app",
      path: "/",
    });
  }
};

// export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
//     if (tokenInfo.accessToken) {
//         res.cookie("accessToken", tokenInfo.accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none"
//         })
//     }

//     if (tokenInfo.refreshToken) {
//         res.cookie("refreshToken", tokenInfo.refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none"
//         })
//     }
// }