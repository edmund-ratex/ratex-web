export {GlossaryTemplate as component} from './GlossaryTemplate';

export function getPageDataLoaders(locale: Locale, slug: string): ContentLoader[] {
  return [
    () => ({
      initValue: {title: 'The Words of Crypto'},
      queries: [
        {
          apiPath: 'cms-articles',
          query: {
            fields: ['locale', 'slug', 'title', 'desc'],
            filters: {
              entry: 'Academy',
              locale,
              tags: {
                name: 'Glossary',
              },
            },
          },
          formatter(data: any[]) {
            const articles: Article[] = data.map((o: any) => ({
              locale: o.locale,
              slug: o.slug,
              title: o.title,
              desc: o.desc,
            }));
            return {articleGroups: groupArticles(articles)};
          },
        },
      ],
    }),
  ];
}

function groupArticles(articles: Article[]): ArticleGroup[] {
  const groups = articles.reduce((p: ArticleGroup[], c: Article): ArticleGroup[] => {
    const firstChar = c.title[0].toUpperCase();
    const key = '0123456789'.includes(firstChar) ? '#' : firstChar;
    const group = p.find((o) => o.key === key);
    if (group) {
      group.articles = [...group.articles, c];
      return p;
    }
    const newGroup: ArticleGroup = {key, articles: [c]};
    return [...p, newGroup];
  }, [] as ArticleGroup[]);
  return groups.sort((a, b) => a.key.localeCompare(b.key));
}
