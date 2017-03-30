# apm-server
`apm-server` - a proxy that enables installation of atom packages behind a firewall

## About apm-server
[apm](https://github.com/atom/apm) doesn't allow installation of atom packages not through official channels.  
`apm-server` lets you install those packages from behind a firewall

## Installation
```bash
# Installation by cloning
$ git clone git@github.com:corevo/apm-server.git
$ npm install
$ npm bulid
$ npm serve

# Proxy Configuration
$ cp .env.sample .env
$ vim .env
# PORT - port to listen on
# NPM_REGISTRY - the sinopia-apm that contains the atom packages, read below
# DOMAIN - the endpoint at which users will reach the proxy
# FEATURED - featured packages to be highlighted in atom's settings
# DEBUG - debug wildcard string application* for my debug logs or * for everything

# Atom configuration
# atom has to be ran with certain env variables to reach the proxy
$ export ATOM_API_URL=http://your-apm-server/api
$ export ATOM_NODE_URL=http://your-apm-server/download/atom-shell

# apm configuration
# If you also use npmjs.org behind firewall you need to configure apm in the same manner
$ apm config set registry http://your-internal-npm-registry
```
The `ATOM_NODE_URL` is used for [atom-shell](https://atom.io/download/atom-shell/v0.36.8/SHASUMS256.txt)  
atom needs to download the respective shell in order to install packages

### Important Note about NPM_REGISTRY
Since some atom packages have the same name as other npm packages.  
e.g. [react](https://github.com/facebook/react) and [atom-react](https://github.com/orktes/atom-react) have the same name in their `package.json` and need to be stored in different npm registries, you would store `atom-react` here, while storing react in any other means.  
Also atom packages have more required tags in their `package.json` so in order for that to work you need to use my fork of [sinopia](https://github.com/corevo/sinopia)
