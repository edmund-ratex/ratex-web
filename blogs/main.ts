import {filter, switchMap} from 'rxjs/operators';
import {router} from '@fd/router';
import {syncRouter} from '@fd/router/sync';
import {url$, updateUrl} from '@fd/streams/url';
import {templates} from './templates';
import {setPageState} from './App';

let currentPathname: string;
let currentLocale: Locale;
let currentComponent: any = null;
let _contentService: ContentService;

export function bootstrap(contentService: ContentService) {
  _contentService = contentService;
  syncRouter(updateUrl);
  url$.pipe(filter(routeFilter), switchMap(startRoute)).subscribe();
}

function routeFilter({action, pathname}: Url): boolean {
  if (['PUSH', 'REPLACE'].includes(action) && pathname === currentPathname) {
    return false;
  }

  return true;
}

async function startRoute({pathname, locale, slug}: Url) {
  if (pathname === '/') {
    router.goto('/en');
    return;
  }
  const template = await findTemplate(slug, pathname);
  if (!template) {
    console.warn('template not found');
    return;
  }
  try {
    await loadPage(locale, slug, template);
    currentPathname = pathname;
    currentLocale = locale;
  } catch (e) {
    console.warn(e);
  }
}

async function findTemplate(slug: string, pathname: string): Promise<Template | undefined> {
  const template = templates.find((o) => o.slug === slug);
  if (template) {
    return template;
  }

  const templateName = await _contentService.findTemplateName(pathname);
  return templates.find((o) => o.name === templateName);
}

async function loadPage(locale: Locale, slug: string, template: Template) {
  const {component, getPageDataLoaders} = await template.loader(locale);
  if (currentComponent) {
    window.scroll({top: 0});
  }

  const {pageData} = await _contentService.loadPreloadedData(template.name, getPageDataLoaders(locale, slug));
  setPageState({component, pageData});
  currentComponent = component;
}
