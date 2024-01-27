import {fixImg1} from '@fd/helper/img';
import {styled} from '@fd/styled';

const Wrap = styled.div`
  margin: 0 auto;
  border-left: 1px solid #2b313a;
  border-right: 1px solid #2b313a;
  border-bottom: 1px solid #2b313a;
  padding-left: 20px;
  background-image: url('${fixImg1('f0986f20/glossary-bg.png')}');
  background-repeat: no-repeat;
  background-position-x: right;
  height: 220px;
  max-width: 1280px;
`;

export function Banner() {
  return (
    <Wrap class="df aic f36 fw3">
      The Words
      <br />
      of Crypto
    </Wrap>
  );
}
