import {createComponent, hydrate} from 'solid-js/web';
import {bootstrap} from './main';
import {App} from './App';

hydrate(() => createComponent(App, {}), document.getElementById('root') as HTMLElement);
bootstrap({findTemplateName, loadPreloadedData});

function findTemplateName(): Promise<string> {
  return Promise.resolve(window.preloadedData.templateName!);
}

function loadPreloadedData(): Promise<PreloadedData> {
  return Promise.resolve(window.preloadedData);
}
