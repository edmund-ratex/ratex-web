import {For} from 'solid-js';
import {styled} from '@fd/styled';
import {ArticleCard} from './ArticleCard';

interface Props {
  articles: any[];
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px 24px;
  margin: 0 auto 60px auto;
  max-width: 1200px;
`;

export function ArticleCardList(props: Props) {
  return (
    <Wrap>
      <For each={props.articles}>{(article) => <ArticleCard slug={article.slug} image={article.image} title={article.title} desc={article.desc} />}</For>
    </Wrap>
  );
}
