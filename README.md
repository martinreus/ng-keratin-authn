# NgKeratinAuthn

Library to easily integrate your Angular App with Keratin authn.
This library allows you to easily log in / log out, subscribe users, etc.

It can be used both for the client side and also if using Server Side rendering.

## WARNING: This library is still in development, don't expect it to work.

If you want to help, please do so as I don't have much spare time to dedicate to this side project :)

Open tasks:
- Tests!
- Cleanup of commented code, TODOS all over
- Fix SSR part, still not 100% working
- bubble back refresh token with the help of the ssr-session.interceptor to the response object from the originating ssr client call, so that the refreshed session
can be used by the browser in subsequent calls.


## Using NPM Link to develop

When developing this library and npm linking into an angular app for testing, remember to:

- you call `npm link` under the dist/ng-keratin-authn folder
- you call `npm link ng-keratin-authn` from your angular project, to use this library
- In you angular application, add `"preserveSymlinks": true` in these locations:
```
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "preserveSymlinks": true,   <= here..

      [...]
      
        "server": {
          "builder": "@angular-devkit/build-angular:server",
          "options": {
            "preserveSymlinks": true,  <= here..

      [...]

        "serve-ssr": {
          "builder": "@nguniversal/builders:ssr-dev-server",
          "options": {
            "preserveSymlinks": true,  <= and here

```
otherwise you'll get an `Error: inject() must be called from an injection context` error when accessing the app through SSR.

## How to use this lib

#### Client side
In `app.client.module`:

```typescript
@NgModule({
  imports: [
      AppModule, 
      // The url points to keratin authn server. 
      // Can be a subroute if you are using a reverse proxy,
      // or also a full URL such as `https://authn.example.com`
      KeratinAuthnModule.forRoot('api/auth')
  ],
  bootstrap: [AppComponent]
})
export class AppClientModule {}

```

#### Server side

If you are using Server side rendering, include this in your server module:
```typescript
@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    // URL here must have the schema, since it will be called from within
    // SSR context. 
    KeratinAuthnModule.forServerRoot('http://authn.address')
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}

```

You will also need to add a provider for the `request` and `response` objects from server.ts, like so:

```typescript
[...]

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [
        // add this line here; we will need req object to extract cookie information
        // and response to bubble up the refreshed session token received from
        // keratin
        keratinReqResSSRProvider(req, res)
      ]
    });
  });

[...]
```

