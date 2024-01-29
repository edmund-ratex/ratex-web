import {styled} from '@fd/styled';
import {Link} from '@fd/link/Link';

interface Props {
  slug: string;
  title: string;
  desc: string;
  image: string;
}

const Wrap = styled(Link)`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
`;

const ImageWrap = styled.div.cls('pr ovh')`
  padding-bottom: 56%;
  height: 0;
  img {
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
    }
  }
`;

export function ArticleCard(props: Props) {
  return (
    <Wrap class="db ovh" locale slug={props.slug}>
      <ImageWrap>
        <img class="pa wp100 hp100" src={props.image} alt="" />
      </ImageWrap>
      <div class="pv24 ph16">
        <div class="mb24 lh36 f24 fw3 T1">{props.title}</div>
        <div class="lh24 f16 T3">{props.desc}</div>
      </div>
    </Wrap>
  );
}
