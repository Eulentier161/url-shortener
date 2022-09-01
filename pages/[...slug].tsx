import { GetServerSidePropsContext } from "next";
import prisma from "../prisma/client";

export default function Redirector(){}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const slug = ctx.query.slug;
  if (slug && typeof slug === "object" && slug.length === 1 && typeof slug[0] === "string") {
    const url = await prisma.url.findUnique({ where: { slug: slug[0] } });
    if (url) return { redirect: { destination: url.destination } };
  }
  return { redirect: { destination: "/" } };
}
