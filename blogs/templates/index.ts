export const templates: Template[] = [
  {
    name: 'BlogHome',
    loader: () => import('./home'),
  },
  {
    name: 'BlogArticle',
    loader: () => import('./article'),
  },
];
