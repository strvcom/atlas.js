'use strict'

module.exports = {
  rules: {
    // We are using import statements from a template file. We don't want those template files'
    // import statements to affect our linting results since those dependencies will be resolvable
    // once the generator runs in a newly scaffolded project.
    'import/no-unresolved': 'off',
  },
}
