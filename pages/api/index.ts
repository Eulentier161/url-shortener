import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const destination = req.body.destination;
  const slug = req.body.slug;
  if (
    !destination ||
    !slug ||
    typeof destination !== "string" ||
    typeof slug !== "string" ||
    req.method !== "POST"
  ) {
    return res.status(400).json({ message: "something went wrong" });
  }

  try {
    await axios.get(req.body.destination);
  } catch {
    return res.status(404).json({ message: "destination url not found" });
  }

  try {
    await prisma.url.create({
      data: { destination, slug },
    });
  } catch (err) {
    return res.status(500).json({ message: "slug is already taken" });
  }

  return res.status(200).json({ message: "success!", url: `http://localhost:3000/${slug}`});
}
