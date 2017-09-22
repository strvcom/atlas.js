# Atlas.js components

You can implement your project-specific components here. The best way to implement them is to create a package in a package, meaning, the component itself will have its own _package.json_ manifest. In your main/root _package.json_, you include this subpackage as a `dependency` as a [local package path](https://docs.npmjs.com/files/package.json#local-paths):

```json
"dependencies": {
  "noop": "file:./src/components/noop"
}
```

## ...but why?

This approach has several benefits:

- You can import this component without relative paths: `import noop from 'noop'` instead of `import noop from '../../components/noop'` etc.
- The component's dependencies are very clear and dropping the component will also drop all of its dependencies from the project (no more dangling unused deps in your main _package.json_)
- You can very easily turn this component into a standalone npm module for re-use in other projects. You can also just copy-paste the component folder into another project and it Just Works™.

Of course, if you do not like this component structure, you can use whichever approach suits your needs. A component is but a class, really.
