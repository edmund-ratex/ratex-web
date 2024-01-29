import {createGlobalStyles, styled} from '@fd/styled';
import {DefaultLayout} from '@fd/modules/layouts/DefaultLayout';

interface ArticleTemplateProps {
  pageData: {
    title: string;
    content: string;
    [index: string]: any;
  };
}

const GlobalStyle = createGlobalStyles`
  html {
    scroll-behavior: smooth;
  }
`;

const Main = styled.main.cls('df fdc aic')``;
const Content = styled.div`
  max-width: 768px;
`;
const HeaderImageWrap = styled.div.cls('br8 ovh')`
  font-size: 0;
  @media screen and (max-width: 640px) {
    border-radius: 0;
  }
`;
const HeaderImage = styled.img.cls('db')`
  max-width: 768px;
  max-height: 432px;
  @media screen and (max-width: 640px) {
    width: 100%;
    max-width: 100%;
  }
`;
const Title = styled.h1`
  margin-top: 48px;
  @media screen and (max-width: 640px) {
    padding: 0 16px;
  }
`;
const ArticleContent = styled.article`
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.8);
  @media screen and (max-width: 640px) {
    padding: 0 16px;
  }
  img {
    max-width: 100%;
  }
`;

export function ArticleTemplate(props: ArticleTemplateProps) {
  return (
    <DefaultLayout subSite noAccount>
      <GlobalStyle />
      <Main>
        <Content>
          <HeaderImageWrap>
            <HeaderImage src={props.pageData.headerImage?.url} alt="" />
          </HeaderImageWrap>
          <Title>{props.pageData.title}</Title>
          <ArticleContent innerHTML={props.pageData.content} />
        </Content>
      </Main>
    </DefaultLayout>
  );
}
