import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(req.body);
    res.redirect(302, `https://farcaster-starknet-frame.vercel.app/verify`);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
