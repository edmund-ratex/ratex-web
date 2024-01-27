import {styled} from '@fd/styled';
import {Link} from '@fd/link/Link';

interface Props {
  slug: string;
  title: string;
  desc: string;
}

const Wrap = styled(Link)`
  border-bottom: 1px solid #2b313a;
  padding: 36px 40px;
  &:hover {
    background: #223241;
  }
`;

export function ArticleItem(props: Props) {
  return (
    <Wrap class="db" locale slug={props.slug}>
      <div class="mb24 lh38 f16 fw3 T1">{props.title}</div>
      <div class="lh24 f14 T3">{props.desc}</div>
    </Wrap>
  );
}
