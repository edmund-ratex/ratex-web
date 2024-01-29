import {createSignal} from 'solid-js';
import {Dynamic} from 'solid-js/web';

const [pageState, setPageState] = createSignal<any>({component: undefined, pageData: null});

export function App() {
  return <Dynamic component={pageState().component} pageData={pageState().pageData} />;
}

export {setPageState};
