import {stringify} from 'qs';
import axios from 'axios';
import {render} from './entry-render';

// const STRAPI_API = 'http://18.141.139.229:1337/api';
const STRAPI_API = 'http://localhost:1337/api';

export async function viteNodeApp(req: any, res: any) {
  if (req.url === '/favicon.ico') {
    res.end('');
    return;
  }

  console.log('Req:', req.url);
  const templateName = await findTemplateName(req.url);
  if (!templateName) {
    res.end('templateName not found');
    return;
  }
  const buildManifestFile = '/Users/zhiguo/fd/fd-solid/packages-cms/academy/dist/client/js/client-manifest.json';
  const html = await render({url: req.url, templateName, buildManifestFile}, findMany);
  res.end(html);
}

async function findTemplateName(url: string) {
  const query = {
    fields: ['url', 'templateName'],
    filters: {url},
  };
  const items = await findMany({apiPath: 'routes', query});
  if (items.length > 0) {
    return items[0].templateName;
  }
  return null;
}

async function findMany({apiPath, query}: FindManyParams): Promise<any[]> {
  const response = await axios.get(`${STRAPI_API}/${apiPath}?${stringify(query)}`);
  return response.data.data;
}
