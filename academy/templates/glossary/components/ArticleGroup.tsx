import {For, Show} from 'solid-js';
import {styled} from '@fd/styled';
import {searchText} from '../state';
import {ArticleItem} from './ArticleItem';

interface Props {
  key: string;
  articles: Article[];
}

const Key = styled.div`
  border-bottom: 1px solid #2b313a;
  padding: 0 40px;
  line-height: 96px;
  font-size: 24px;
`;

export function ArticleGroup(props: Props) {
  const displayArticles = () => props.articles.filter((article: Article) => article.title.toLowerCase().includes(searchText().toLowerCase()));
  return (
    <Show when={displayArticles().length > 0} keyed>
      <div>
        <Key>{props.key}</Key>
        <For each={displayArticles()}>{(article: Article) => <ArticleItem slug={article.slug} title={article.title} desc={article.desc} />}</For>
      </div>
    </Show>
  );
}
