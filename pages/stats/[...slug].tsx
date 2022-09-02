import { Redirect, Url } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import prisma from "../../prisma/client";

export default function Stat({ url }: { url: Url & { redirects: Redirect[] } }) {
  return (
    <div className="container">
      <form>
        <div>
          Your redirect <i>{url.slug}</i> received{" "}
          <b>{url.redirects.length} hits</b>.
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const slug = ctx.query.slug;
  if (
    slug &&
    typeof slug === "object" &&
    slug.length === 1 &&
    typeof slug[0] === "string"
  ) {
    const url = await prisma.url.findUnique({
      where: { slug: slug[0] },
      include: { redirects: true },
    });

    if (url) {
      return { props: { url } };
    }
  }
}
