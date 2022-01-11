# dumi-pnpm-template
dumi + lerna + pnpm 
## tips
1.  husky(6.0.0)版本做了Breaking change, 放弃了传统的 JS 配置
    ```bash
    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
    ```