export const templates: Template[] = [
  {
    name: 'AcademyHome',
    slug: '/',
    loader: () => import('./home'),
  },
  {
    name: 'AcademyGlossary',
    slug: '/glossary',
    loader: () => import('./glossary'),
  },
  {
    name: 'AcademyArticle',
    loader: () => import('./article'),
  },
];
