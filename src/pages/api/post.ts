import type { NextApiRequest, NextApiResponse } from "next";

import { BASE_URL, generateFarcasterFrame, validateMessage } from "@/utils";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const redirectUrl = `${BASE_URL}/verify`;
  // const { actionType, redirectUrl } = req.body;
  // if (actionType === "post_redirect") {
  // Perform the redirect
  res.setHeader("Location", redirectUrl);
  res.status(302).end();
  // } else {
  // Handle other types of actions or default action
  // Respond with a new frame or a message
  // res.status(200).send(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta property="fc:frame" content="vNext" />
  //         <meta property="fc:frame:image" content="http://...image-response.png" />
  //       </head>
  //       <body>
  //         Response Content
  //       </body>
  //     </html>
  // `);
}

// const signedMessage = req.body as {
//   untrustedData: {
//     fid: number;
//     url: string;
//     messageHash: string;
//     timestamp: number;
//     network: number;
//     buttonIndex: number;
//     castId: { fid: number; hash: string };
//   };
//   trustedData?: {
//     messageBytes: string;
//   };
// };

// // `trustedData` doesn't get returned by the Warpcast embed debugger, but we should validate it if it's there
// // This if statement should probs be removed in prod
// if (signedMessage.trustedData) {
//   const isMessageValid = await validateMessage(
//     signedMessage.trustedData.messageBytes
//   );

//   if (!isMessageValid) {
//     return res.status(400).json({ error: "Invalid message" });
//   }
// }

// const choice = signedMessage.untrustedData.buttonIndex;

// let html: string = "";

// if (choice === 1) {
//   html = generateFarcasterFrame(`${BASE_URL}/happy.jpg`, choice);
// } else {
//   html = generateFarcasterFrame(`${BASE_URL}/threat.jpg`, choice);
// }

// return res.status(200).setHeader("Content-Type", "text/html").send(html);
