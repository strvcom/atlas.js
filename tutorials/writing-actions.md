# Writing actions

## What is an action?

An action is basically what a controller in an MVC architecture is. It is the glue that interacts with various services and other actions to achieve some business-specific task.

Using actions is optional (unless you are writing a component which you want other people to use), but they are a great place to put re-usable pieces of logic. You can then call your actions from an http server, or from a CLI interface or from an interactive REPL session. If you put all this logic into an http route handler, you would not be able to easily execute it from other places.

Some common traits of an action:

- They usually interact with many other components (like services or other actions)
- They frequently contain business-specific logic or accomplish a very specific task
- They do not need to keep any kind of state (they are stateless - it's just input params->returning results)

> **NOTE**: Contrary to services and hooks, the Action class you implement **is** what you will interface with - when you register an Action into the Application, the class is instantiated and exposed to you via `app.actions.*`.

## Structure of an action

An Action is a class which is instantiated by the Application upon adding it and the methods it implements are accessible to anyone else.

Here is a bare class which shows how an Action works.

```js
import Action from '@atlas.js/action'
import joi from 'joi'

class User extends Action {
  async create(data) {
    // Get the database component (assuming you have registered such component
    // into your app)
    const db = this.component('service:database')
    // Run some checks on the data (using imaginary validation library)
    joi.validate(data)

    // Save the data to the database
    const user = await db.users.insert(data)

    return user
  }

  async delete(id) {
    const db = this.component('service:database')
    await db.users.delete({ id })
  }
}

export default User
```

## Using an action

Once you have your action class ready, it's time to add it to your app!

```js
import { Application } from '@atlas.js/core'
import User from './user'

const app = new Application({
  root: __dirname,
  env: process.env.NODE_ENV,
  actions: {
    // Some actions might accept configuration options - this is where you would put them!
    user: {}
  }
})

app.action('user', User)
app.start()
.then(async () => {
  // We can now call the action's methods this way:
  const user = await app.actions.user.create({
    name: 'test',
    password: 'lolpwd'
  })
})
```
