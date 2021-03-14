## Answers


**What is the difference between Component and PureComponent? give an example where it might break my app.**

  

PureComponent uses predefined ShouldComponentUpdate which makes compare of current props and new (changed) props. But the compare is shallow and this may cause a problem: for example if you pass an array as prop and update it later in mutable style (using push method for example) PureComponent will not detect that change and will not re-render the component.

  

**Context + ShouldComponentUpdate might be dangerous. Can think of why is that?**

  

Problems comes when you try to change already initiated context data: SCU doesn't track context changes so required components will not be re-rendered. Think twice before use Context in React at all.

  

**Describe 3 ways to pass information from a component to its PARENT.**

  

1.  Use callback as prop. For example we pass prop onData from PARENT to the CHILD and call onData in CHILD later.
2.  Use redux store
3.  Use event-bus lib which makes ability to emit and receive events in any parts of the application.

  

**Give 2 ways to prevent components from re-rendering.**

  

1.  Write suitable SCU for your component (React.memo if you use functional style components) or use PureComponent.
2.  Cache callbacks and state where suitable. useCallback, useMemo and equivalents in class components.

  

**What is a fragment and why do we need it? Give an example where it might break my app.**

  

Fragments created for situations when you need to render multiple root nodes but don't have ability to create html wrapper for them (div for example). The most common usage is rendering multiple \<td\>s. I understand intuitively that it's better to avoid overuse of react fragments but can't to formulate why.

  

**Give 3 examples of the HOC pattern.**

  

1.  HOC which passes additional props to the component (that's how redux connect works)
2.  HOC to re-render component on socket data income
3.  HOC to show system message above the component in case of error for example

  

**What's the difference in handling exceptions in promises, callbacks and async...await.**

  

 - In promises we need to use catch for the handling.
 - Callbacks passes error in first argument (null is everything are ok).
 - For async...await we need to use try catch block to handle exceptions.

  

**How many arguments does setState take and why is it async.**

  

Two, second is callback which is called when state update is applied. It is async because react waiting for all setState calls to be finished before re-render the component. Example: parent component passes onChildClick prop to the child component and inside this onChildClick calls setState. Then inside child component we bind event listener onButtonClick which calls setState and then onChildClick. If setState would change state immediately then in this situation the child component would be rendered twice.

  

**List the steps needed to migrate a Class to Function Component.**

  

1.  Change class declaration to function :)
2.  Replace methods to usual functions (const onSubmit = () => ...)
3.  Replace lifecycle methods with useEffect hook
4.  Replace render method with return
5.  Remove class constructor if you have. Not just remove of course, move logic to the function body. How exactly to move depends on what you have in your constructor.
6.  Use React.memo instead of PureComponent
7.  Get rid of "this"
8.  Replace setState with useState hook
9.  Maybe forgot something, look at react hooks docs and you will find all required replacements. useRef hook instead of React.createRef etc.

  

**List a few ways styles can be used with components.**

  

You can use global styles which applied to all components, you can write style per every component separately (usually it is style file which is in the same component folder and which imports to the component), you can use scoped styles (I prefer react-scoped-style lib) or css modules (worse than react-scoped-style because modules modifies class names which often makes really hard to debug layout).

  

**How to render an HTML string coming from the server.**

  

Use dangerouslySetInnerHTML attribute if you are sure that this HTML string is safe to render.