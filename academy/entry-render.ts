import {createRequire} from 'node:module';
import {createComponent, renderToString} from 'solid-js/web';

import '@fd/helper/pollyfill/array';
import '@fd/helper/pollyfill/map';
import '@fd/helper/pollyfill/rxjs';
import {extractCss} from '@fd/styled';
import {parsePathname} from '@fd/helper/locale';
import {loadContentData} from '@fd/helper/strapi';
import {buildId} from './package.json';
import {templates} from './templates';
import {Root} from './Root';

const require = createRequire(import.meta.url);

export async function render({url, templateName, buildManifestFile}: {url: string; templateName: string; buildManifestFile: string}, findMany: ({apiPath, query}: FindManyParams) => Promise<any[]>) {
  const template = findTemplate(templateName);
  if (!template) {
    throw `template not found, url: ${url}`;
  }
  const {locale, slug} = parsePathname(url);
  const {component, getPageDataLoaders} = await template.loader(locale);
  const pageData = await loadContentData(getPageDataLoaders(locale, slug), findMany);
  const buildManifest = require(buildManifestFile);
  return genHtml(component, pageData, templateName, buildManifest);
}

export function upload({url, html}: {url: string; html: string}, uploadToS3: (params: {key: string; body: any; contentType: string}) => Promise<void>) {
  return uploadToS3({key: `academy.rubydex.com${url}`, body: html, contentType: 'text/html'});
}

function findTemplate(templateName: string) {
  return templates.find((template: Template) => template.name === templateName);
}

function genHtml(component: any, pageData: any, templateName: string, buildManifest: any) {
  const innerHtml = renderToString(() => createComponent(component, {pageData}));
  const entry = `https://static.rubydex.com/${buildId}/` + buildManifest['entry-client-prod.ts']['file'];
  return '<!DOCTYPE html>' + renderToString(() => createComponent(Root, {css: extractCss(), innerHtml, entry, templateName, pageData}));
}
