//@ts-nocheck
import { parsePaginationArgs } from "$main/src/lib/func";
import prisma from "$main/src/lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    let { take, page, skip } = parsePaginationArgs(url, 10);
    let query = url.searchParams.get('q')?.trim();
    let helps = !query ?
        await prisma.helpArticle.findMany({ select: { id: true, question: true }, orderBy: { updatedAt: 'desc' }, take: take + 1, skip })
        : await prisma.$queryRaw`
  SELECT id, question,
         ts_rank_cd(
           setweight(to_tsvector('english', question), 'A') ||
           setweight(to_tsvector('english', answer), 'B'),
           plainto_tsquery('english', ${query})
         ) AS rank
  FROM "HelpArticle"
  WHERE to_tsvector('english', question || ' ' || answer)
        @@ plainto_tsquery('english', ${query})
  ORDER BY rank DESC
  LIMIT ${take + 1}
  OFFSET ${skip};
`;
    let hasNext = helps.length == take + 1;
    if (hasNext) {helps.pop()}
    return { helps, page, hasNext, query }
};
