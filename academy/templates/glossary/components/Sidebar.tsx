import {styled} from '@fd/styled';
import {searchText, setSearchText} from '../state';

const Wrap = styled.div`
  margin: 0 auto;
  border-right: 1px solid #2b313a;
  width: 240px;
`;

const SearchInput = styled.input`
  box-sizing: border-box;
  border: 1px solid #2b313a;
  padding: 0 12px;
  width: 100%;
  line-height: 48px;
  background: transparent;
  color: #fff;
  outline: none;
`;

export function Sidebar() {
  return (
    <Wrap class="f36 fw3">
      <div class="mt20 ph16">
        <SearchInput class="br4" placeholder="Search term here" value={searchText()} onInput={(e) => setSearchText((e.target as HTMLInputElement).value)} />
      </div>
    </Wrap>
  );
}
