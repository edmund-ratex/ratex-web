interface Url {
  // @ts-ignore
  action: 'INIT' | 'PUSH' | 'REPLACE' | 'GO_BACK' | 'GO_FORWARD';
  href: string;
  fullPathname: string;
  locale: Locale;
  pathname: string;
  // @ts-ignore
  key: string;
  query: UrlQuery;
}
