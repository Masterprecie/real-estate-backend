// import { NextResponse } from "next/server";

// // Set cookie with jwt token
// export const setCookie = (res: NextResponse, token: string) => {
//   res.cookies.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//     sameSite: "strict",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   });
// };

// // Clear cookie
// export const clearCookie = (res: NextResponse, name: string) => {
//   res.cookies.set(name, "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//     sameSite: "strict",
//     maxAge: 0, // Expire immediately
//   });
// };
