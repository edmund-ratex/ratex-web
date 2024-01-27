import {For} from 'solid-js';
import {styled} from '@fd/styled';
import {ArticleGroup} from './ArticleGroup';

interface Props {
  articleGroups: ArticleGroup[];
}

const Wrap = styled.div`
  margin: 0 auto 60px auto;
  max-width: 1200px;
`;

export function ArticleGroupList(props: Props) {
  return (
    <Wrap class="f1">
      <For each={props.articleGroups}>{(articleGroup: ArticleGroup) => <ArticleGroup key={articleGroup.key} articles={articleGroup.articles} />}</For>
    </Wrap>
  );
}
