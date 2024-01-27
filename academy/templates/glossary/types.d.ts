interface Article {
  title: string;
  desc: string;
  locale: Locale;
  slug: string;
}

interface ArticleGroup {
  key: string;
  articles: Article[];
}
