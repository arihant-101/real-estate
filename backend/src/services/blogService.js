import { prisma } from "../lib/prisma.js";

export async function listPosts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const where = { publishedAt: { not: null } };
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, author: true },
    }),
    prisma.blogPost.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function getPostBySlug(slug) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, publishedAt: { not: null } },
  });
  if (!post) {
    const err = new Error("Post not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  return post;
}
