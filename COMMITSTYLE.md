SOURCE: https://github.com/portainer/portainer/blob/develop/CONTRIBUTING.md

This style is based on portainers contributing guideline and will be adapted for the use-cases of this project in future.

## Commit Message Format

Each commit message should include a **type**, a **scope** and a **subject**:

```
 <type>(<scope>): <subject>
```

Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log ie:

```
 #271 feat(containers): add exposed ports in the containers view
 #270 fix(templates): fix a display issue in the templates view
 #269 style(dashboard): update dashboard with new layout
```

### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature (catch-all)
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope

The scope could be anything specifying place of the commit change. For example `networks`,
`containers`, `images` etc...
You can use the **area** label tag associated on the issue here (for `area/containers` use `containers` as a scope...)

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end
