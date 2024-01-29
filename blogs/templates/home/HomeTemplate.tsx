import {createGlobalStyles, styled} from '@fd/styled';
import {DefaultLayout} from '@fd/modules/layouts/DefaultLayout';
import {ArticleCardList} from './components/ArticleCardList';

interface Props {
  pageData: {
    title: string;
    articles: any[];
  };
}

const GlobalStyle = createGlobalStyles`
  html {
    scroll-behavior: smooth;
  }
`;

const Title = styled.h1`
  margin: 100px 0 40px 0;
  font-size: 64px;
`;

export function HomeTemplate(props: Props) {
  return (
    <DefaultLayout subSite noAccount>
      <GlobalStyle />
      <Title class="tc fw3">{props.pageData.title}</Title>
      <ArticleCardList articles={props.pageData.articles} />
    </DefaultLayout>
  );
}
