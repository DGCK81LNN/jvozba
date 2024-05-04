# `@dgck81lnn/jvozba`

Slightly modified version of [`sozysozbot_jvozba`](https://github.com/sozysozbot/sozysozbot_jvozba) as an npm package.

The original project was made of scripts instead of modules; this version makes all TypeScript files modules and exports almost everything via `index.ts`.

Some modifications are made to make the library easier to use, such as:

  * `jvozba_gui.ts` and `jvokaha_gui.ts` in the original project contained some useful logic which I generalized into the functions `jvozbaSmart()` and `jvokahaSmart()` and placed in a new `smart.ts`.

  * Jvozba and jvokahaSmart return more information.

  * Jvozba results containing experimental rafsi, as well as cmevla containing forbiddin la/lai/doi sequences, are always included but marked by boolean flags. Filter them out if necessary.

## Examples

```typescript
import { jvozbaSmart, jvokahaSmart } from "@dgck81lnn/jvozba"
```

```typescript
jvozbaSmart("lab- ditcu")
// Returns:
;({
  components: [ 'blabi', 'ditcu' ],
  results: [
    {
      parts: [
        { selrafsi: 'blabi', part: 'lab', experimental: false },
        { selrafsi: 'ditcu', part: 'dit', experimental: true }
      ],
      lujvo: 'labdit',
      score: 5898,
      cmevla: true,
      usesExperimentalRafsi: true,
      forbiddenLaLaiDoiCmevla: true
    },
    {
      parts: [
        { selrafsi: 'blabi', part: 'lab', experimental: false },
        { selrafsi: 'ditcu', part: 'ditc', experimental: false }
      ],
      lujvo: 'labditc',
      score: 6928,
      cmevla: true,
      usesExperimentalRafsi: false,
      forbiddenLaLaiDoiCmevla: true
    },
    {
      parts: [
        { selrafsi: 'blabi', part: 'lab', experimental: false },
        { selrafsi: 'ditcu', part: 'ditcu', experimental: false }
      ],
      lujvo: 'labditcu',
      score: 7937,
      cmevla: false,
      usesExperimentalRafsi: false,
      forbiddenLaLaiDoiCmevla: false
    },
    {
      parts: [
        { selrafsi: 'blabi', part: 'blab', experimental: false },
        { selrafsi: null, part: 'y', experimental: false },
        { selrafsi: 'ditcu', part: 'dit', experimental: true }
      ],
      lujvo: 'blabydit',
      score: 8008,
      cmevla: true,
      usesExperimentalRafsi: true,
      forbiddenLaLaiDoiCmevla: false
    },
    {
      parts: [
        { selrafsi: 'blabi', part: 'blab', experimental: false },
        { selrafsi: null, part: 'y', experimental: false },
        { selrafsi: 'ditcu', part: 'ditc', experimental: false }
      ],
      lujvo: 'blabyditc',
      score: 9038,
      cmevla: true,
      usesExperimentalRafsi: false,
      forbiddenLaLaiDoiCmevla: false
    },
    {
      parts: [
        { selrafsi: 'blabi', part: 'blab', experimental: false },
        { selrafsi: null, part: 'y', experimental: false },
        { selrafsi: 'ditcu', part: 'ditcu', experimental: false }
      ],
      lujvo: 'blabyditcu',
      score: 10047,
      cmevla: false,
      usesExperimentalRafsi: false,
      forbiddenLaLaiDoiCmevla: false
    }
  ]
})
```

```typescript
jvokahaSmart("najnimryjisr")
// Returns:
;[
  { part: 'naj', selrafsi: 'narju', experimental: false },
  { part: 'nimr', selrafsi: 'nimre', experimental: false },
  { part: 'y', selrafsi: null, experimental: false },
  { part: 'jisr', selrafsi: 'jisra', experimental: false }
]
```
