import {stringify} from 'qs';
import {createComponent, render} from 'solid-js/web';
import {get} from '@fd/helper/http';
import {loadContentData} from '@fd/helper/strapi';
import {bootstrap} from './main';
import {App} from './App';

const STRAPI_HOST = import.meta.env.VITE_DEV_STRAPI_HOST || 'http://localhost:1337';

window.preloadedData = {
  templateName: '',
  pageData: null,
};

render(() => createComponent(App, {}), document.getElementById('root') as HTMLElement);
bootstrap({findTemplateName, loadPreloadedData});

async function findTemplateName(url?: string): Promise<string> {
  const apiPath = 'routes';
  const query: ContentQuery = {fields: ['templateName'], filters: {url}};
  const data = await findMany({apiPath, query});
  return data.length > 0 ? data[0].templateName : '';
}

async function loadPreloadedData(templateName: string, pageDataLoaders: ContentLoader[]): Promise<PreloadedData> {
  const pageData = await loadContentData(pageDataLoaders, findMany);
  document.title = pageData.title;
  return {templateName, pageData};
}

async function findMany({apiPath, query}: FindManyParams): Promise<any> {
  const {reply} = await get<any>(`${STRAPI_HOST}/api/${apiPath}?${stringify(query)}`);
  return reply.data;
}
