# @thomasdmgs/svelte-kit-adapter-express

[Adapter](https://kit.svelte.dev/docs/adapters) for SvelteKit apps that generates a standalone Express server.

## Usage

Install with `npm i -D @thomasdmgs/svelte-kit-adapter-express`, then add the adapter to your `svelte.config.js`:

```javascript
// svelte.config.js
import adapter from '@thomasdmgs/svelte-kit-adapter-express';

export default {
  kit: {
    adapter: adapter()
  }
};
```

## Options

The adapter can be configured with various options:

```javascript
// svelte.config.js
import adapter from '@thomasdmgs/svelte-kit-adapter-express';

export default {
  kit: {
    adapter: adapter({
      // default options are shown
      out: 'build',
      preCompress: false,
      serverFile: undefined
    })
  }
};
```

### out

The directory to build the server to. It defaults to `build` — i.e. `node build` would start the server locally after it has been created.

### preCompress

Enables pre-compressing using gzip and brotli for assets and prerendered pages. It defaults to `false`.

### serverFile

The absolute path to your custom server file. Defaults to `undefined`, i.e. it will use the default server included in this package. See [custom server](#custom-server) section for more details.

## Custom server

To set up a custom server, copy the default server from the module:

```shell
mkdir -p adapter
cp node_modules/@thomasdmgs/svelte-kit-adapter-express/files/server.js adapter
```

Edit the newly copied file `adapter/server.js` so that it suits your needs.

When configuring the adapter in `svelte.config.js`, add a `serverFile` parameter:

```typescript
import path from 'path';
import adapter from '@thomasdmgs/svelte-kit-adapter-express';

const __dirname = path.resolve();

module.exports = {
  kit: {
      	adapter: adapter({
            serverFile: path.join(__dirname, './adapter/server.js')
        }),
  },
};
```

## Deploying

You will need the output directory (`build` by default), the project's `package.json`, and the production dependencies in `node_modules` to run the application. Production dependencies can be generated with `npm ci --prod`, you can also skip this step if your app doesn't have any dependencies. You can then start your app with

```shell
node build
```

## Changelog

[The Changelog for this package is available on GitHub](https://github.com/thomasdom/svelte-kit-adapter-express/blob/master/CHANGELOG.md).

## License

[MIT](LICENSE)
