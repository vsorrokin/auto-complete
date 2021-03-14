## Auto-complete component for react

### Local preview and development

    yarn
    yarn start

### Code preview

The component code is located at [src/component/index.jsx](src/component/index.jsx)

Here you can edit component example props: [src/component/index.stories.jsx](src/component/index.stories.jsx)

### Example of usage

    <AutoComplete
	  label="Select country"
	  placeholder="Start typing country name..."
	  searchFn={(q) => axios.get(ENDPOINT, { query: q }).then(({ data }) => data)}
	  onChange={(v) => console.log(v)}
	/>

### Build and publish

    yarn build
    npm publish
  
 
### Live demo

Storybook demo: https://604ddfc2ff8ae90021ea2bb1-iryayibmsg.chromatic.com/

Component only demo: https://604ddfc2ff8ae90021ea2bb1-iryayibmsg.chromatic.com/iframe.html?id=example-auto-complete--primary&viewMode=story

Component props docs: https://604ddfc2ff8ae90021ea2bb1-iryayibmsg.chromatic.com/?path=/docs/example-auto-complete--primary