export const UncontrolledInput = `
function UncontrolledInput({ defaultValue, ...props }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <input
      value={value}
      onChange={event => setValue(event.target.value)}
      {...props}
    />
  );
}
`;

export const ClickSpy = `
function ClickSpy() {
  useEffect(() => {
    function handleClick() {
      alert("clicked");
    }
    document.addEventListener("click", handleClick);
    // The function return by the effect is the clean up
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return null;
}
`;

export const useDebounce = `
function useDebounce(query, delay) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setValue(query), delay);

    return () => clearTimeout(timer);
  }, [delay, query]);

  return value;
}
`;

export const queryExample = `
function App() {
    const [query, changeQuery] = useState("");
    const debounced = useDebounce(query, 500);

    useEffect(() => {
      document.title = "Workshop - React Europe";
    }, []);
  
    return (
      <>
        <SearchInput 
          value={query} 
          onChange={e => changeQuery(e.target.value)}
        />
        <p>Search: {debounced}</p>
      </>
    );
  }`;

export const useAsyncResource = `
const resource = axios.create({ baseURL: "https://pokeapi.co/api/v2/" });

function useAsyncResource(query) {
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (!query) return setResult([]);
    // let cancel = false;
    const source = axios.CancelToken.source();

    resource
      .get(\`/type/\${query}\`, {
        cancelToken: source.token
      })
      .then(({ data }) => {
        // if (!cancel) setResult(data);
        setResult(data);
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log(error.message);
        }
      });

    return () => {
      // cancel = true;
      source.cancel("Operation canceled.");
    };
  }, [query]);

  return result;
}
`;

export const deboucedFetchExample = `
function App() {
  const [query, changeQuery] = useState("");
  const debounced = useDebounce(query, 200);
  // remember to throttle network
  const { pokemon: [] } = useAsyncResource(debounced);

  useEffect(() => {
    document.title = "Workshop - React Europe";
  }, []);

  return (
    <>
      <SearchInput value={query} onChange={e => changeQuery(e.target.value)} />
      <p>Search: {debounced}</p>
      {pokemon.map(({ pokemon: { name } }) => (
        <div key={id}>{name}</div>
      ))}
    </>
  );
}
`;

export const renderPropsExample = `
function PokeData({ query, children }) {
  const debounced = useDebounce(query, 200);
  const { pokemon = [] } = useAsyncResource(debounced);
  return children({ pokemon });
}
`;

export const renderPropsApp = `
function App() {
  const [query, changeQuery] = useState("");

  useEffect(() => {
    document.title = "Workshop - React Europe";
  }, []);

  return (
    <>
      <SearchInput value={query} onChange={e => changeQuery(e.target.value)} />
      <p>Search: {query}</p>
      <PokeData query={query}>
        {({ pokemon }) =>
          pokemon
            .map(({ pokemon: { name, ...rest } }) => (
              <Pokemon {...rest} name={name} />
            ))
        }
      </PokeData>
    </>
  );
}`;

export const failEffect = `// fails
function Inc() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => console.log(count), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <button onClick={() => setCount(count => count + 1)}>Increment</button>
  );
}
`;

export const fixedEffect = `
function Inc() {
  const [count, setCount] = useState(0);
  const countRef = useRef(); // you can pass something here :)
  countRef.current = count; // value is stored in current
  useEffect(() => {
    const interval = setInterval(() => console.log(countRef.current), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <button onClick={() => setCount(count => count + 1)}>Increment</button>
  );
}
`;

export const classicInputRef = `
function SearchInput() {
  // ref.current is a reference toward the DOM element once mounted.
  const ref = useRef();
  return <input type="text" ref={ref} />;
}
`;

export const inputWithFwdRef = `
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  // redefine the surface API exposed
  useImperativeHandle(ref, () => ({
    fancyFocus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} className="FancyInput" />;
});
`;

export const InputParent = `
// Autofocus
function App() {
  const searchInputRef = useRef();
  useEffect(() => {
    searchInputRef.current.fancyFocus();
  }, []);

  return <FancyInput ref={searchInputRef} />;
}
`;

export const useForkRef = `
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function useForkRef(refA, refB) {
  /**
   * Creates a new function if the ref props change and are defined.
   * React calls the old forkRef with \`null\` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   * useCallback forces evaluation from the API consumer side.
   */
  return React.useMemo(() => {
    if (refA === null && refB === null) {
      return null;
    }
    return refValue => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
`;

export const useUseForkRef = `
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = React.useRef();

  const handleRef = useForkRef(ref, inputRef);

  return <input ref={handleRef} className="FancyInput" />;
});
`;

export const useEventCallback = `
// Important for SSR
const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// https://github.com/facebook/react/issues/14099#issuecomment-440013892
function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  // make an indirect reference to ref.current, yields ref.current
  return React.useCallback(event => (0, ref.current)(event), []);
}
`;

export const useMount = `
function useMount(callback) {
  const callbackRef = useRef();
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);
}
`;

export const useEventListener = `
function useEventListener(target, event, callback) {
  const callbackRef = useRef();
  callbackRef.current = callback;

  useEffect(() => {
    console.log("Adding event listener ", event);
    const handleEvent = e => callbackRef.current(e);
    target.addEventListener(event, handleEvent);

    return () => target.removeEventListener(event, handleEvent);
  }, [event, target]);
}
`;

export const naiveRedux = `
const ReduxContext = createContext(); // Do not export 

export function ReduxProvider({ reducer, initialState, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  
  return (
    <ReduxContext.Provider value={value}>{children}</ReduxContext.Provider>
  );
}

export function useRedux() {
  return useContext(ReduxContext);
}
`;

export const useNaiveRedux = `
function App() {
  return (
    <ReduxProvider reducer={reducer} initialState={initialState}>
      <>
        <RegisterButton />
      </>
    </ReduxProvider>
  );
}

function RegisterButton() {
  const { dispatch } = useRedux();

  return (
    <button onClick={() => dispatch({ type: "register" })}>Register</button>
  );
}
`;

export const hiddenProp = `
function Slideshow(props) {
  return (
    <div>
      <div hidden={props.current !== 0}>
        <Expensive1 />
      </div>
      <div hidden={props.current !== 1}>
        <Expensive2 />
      </div>
      <div hidden={props.current !== 2}>
        <Expensive3 />
      </div>
    </div>
  );
}
`;
