import {createGlobalStyles, styled} from '@fd/styled';
import {DefaultLayout} from '@fd/modules/layouts/DefaultLayout';
import {Banner} from './components/Banner';
import {Sidebar} from './components/Sidebar';
import {ArticleGroupList} from './components/ArticleGroupList';

interface Props {
  pageData: {
    title: string;
    articleGroups: any[];
  };
}

const GlobalStyle = createGlobalStyles`
  html {
    scroll-behavior: smooth;
  }
`;

const Main = styled.div`
  margin: 0 auto;
  border-left: 1px solid #2b313a;
  border-right: 1px solid #2b313a;
  border-bottom: 1px solid #2b313a;
  max-width: 1280px;
  font-size: 64px;
`;

export function GlossaryTemplate(props: Props) {
  return (
    <DefaultLayout subSite noAccount>
      <GlobalStyle />
      <Banner />
      <Main class="df">
        <Sidebar />
        <ArticleGroupList articleGroups={props.pageData.articleGroups} />
      </Main>
    </DefaultLayout>
  );
}
