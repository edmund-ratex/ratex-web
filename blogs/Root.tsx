import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {stringify} = require('json5');

type AppProps = {
  innerHtml: string;
  css: string;
  entry: string;
  templateName: string;
  pageData: any;
};

export function Root(props: AppProps) {
  // TODO: lang
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{props.pageData.title}</title>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimal-ui" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={props.pageData.desc} />
        <link rel="shortcut icon" type="image/ico" href="https://img.rubydex.com/ebd16b/favicon.ico" />
        <link rel="stylesheet" href="https://static.rubydex.com/000/css/global-6c8fc9.css" />
        <link rel="stylesheet" href="https://static.rubydex.com/000/css/global-xs-2a521e.css" />
        <style>{props.css}</style>
        <style>{getFontFaceStyle().trim()}</style>
        <script innerHTML={getGTMScript()}></script>
        <script innerHTML={generateHydrationScript()}></script>
      </head>
      <body class="dark">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KFNNBFG" height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <div id="root" innerHTML={props.innerHtml} />
        <script innerHTML={genPreloadedData(props.templateName, props.pageData)}></script>
        <script type="module" src={props.entry}></script>
      </body>
    </html>
  );
}

function getFontFaceStyle() {
  return `
html,
body,
#root {
  background: #000;
}
@font-face {
  font-family: BASE;
  src: url('https://static.rubydex.com/100/font/Eina03-Regular.woff2') format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: BASE;
  src: url('https://static.rubydex.com/100/font/Eina03-Bold.woff2') format('woff2');
  font-weight: 700;
}`;
}

function getGTMScript() {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KFNNBFG');`;
}

function generateHydrationScript() {
  const code =
    'var e,t;e=window._$HY||(_$HY={events:[],completed:new WeakSet,r:{}}),t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host instanceof Node?e.host:e.parentNode)),["click","input"].forEach((o=>document.addEventListener(o,(o=>{let s=o.composedPath&&o.composedPath()[0]||o.target,a=t(s);a&&!e.completed.has(a)&&e.events.push([a,o])})))),e.init=(t,o)=>{e.r[t]=[new Promise(((e,t)=>o=e)),o]},e.set=(t,o,s)=>{(s=e.r[t])&&s[1](o),e.r[t]=[o]},e.unset=t=>{delete e.r[t]},e.load=t=>e.r[t];';
  return `(()=>{${code}})();`;
}

function genPreloadedData(templateName: string, pageData: any) {
  return `window.preloadedData=${stringify({templateName, pageData})};`;
}
