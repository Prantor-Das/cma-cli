1) in server change CLIENT_URL to CORS_ORIGIN.
2) in case of pnpm there will be pnpm-workplace file in server:-
"ignoredBuiltDependencies:
  - esbuild"
3) remove "@types/bun": "latest", if we are not using bun
4) devDependencies lighten up