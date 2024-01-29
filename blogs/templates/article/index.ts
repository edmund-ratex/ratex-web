export {ArticleTemplate as component} from './ArticleTemplate';

export function getPageDataLoaders(locale: Locale, slug: string): ContentLoader[] {
  return [
    () => ({
      queries: [
        {
          apiPath: 'cms-articles',
          query: {
            fields: ['title', 'desc', 'content'],
            populate: {
              headerImage: {
                fields: ['url'],
              },
            },
            filters: {locale, slug},
          },
          formatter(data: any) {
            return data[0];
          },
        },
      ],
    }),
  ];
}
