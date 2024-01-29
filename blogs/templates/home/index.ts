export {HomeTemplate as component} from './HomeTemplate';

export function getPageDataLoaders(locale: Locale, slug: string): ContentLoader[] {
  return [
    () => ({
      initValue: {title: 'RubyDex Blog'},
      queries: [
        {
          apiPath: 'cms-articles',
          query: {
            fields: ['slug', 'title', 'desc'],
            populate: {
              headerImage: {
                fields: ['url'],
              },
            },
            filters: {entry: 'Blog', locale},
          },
          formatter(data: any) {
            return {articles: data.map((o: any) => ({slug: o.slug, title: o.title, desc: o.desc, image: o.headerImage?.url || 'https://img.rubydex.com/v1/2e9bcac0/ruby-1.png'}))};
          },
        },
      ],
    }),
  ];
}
