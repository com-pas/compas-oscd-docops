# CoMPAS OpenSCD Document Operations Monorepo

This repository hosts the components and plugins related to the (db-stored) SCL documents lifecycle management within the CoMPAS OpenSCD project.

## Components and Plugins

The following components are featured in this repository:

- `compas-loading` (**TODO**: add README to compas-loading)
- [`compas-open`](/components/compas-open/README.md)
- `compas-scl-list` (**TODO**: add README to compas-scl-list)
- `compas-scl-type-list` (**TODO**: add README to compas-scl-type-list)
- `oscd-filter-button` (**TODO**: move this to [`@openscd/oscd-components`](https://github.com/openscd/oscd-components))

The following plugins are featured in this repository:
- [`compas-open`](/packages/compas-open-plugin/README.md) 

## Usage
This project uses [Nx](https://nx.dev/), a set of extensible dev tools for monorepos. It is used in this repository to manage the development and build process of the various components and plugins. Feel free to use any of the Nx commands in here.

We provide the following scripts for your convenience:
    
- `npm test` runs the tests in all the components
- `npm run build` builds a deployable version of every component into their /dist directory
- `npm build:all` same as the one before but it tells Nx to skip the cache 
- `bundle` generates a javascript bundle for every plugin

© 2023 Alliander N.V.
