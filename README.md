# @funboxteam/harold

<img align="right" width="192" height="192"
     alt="Harold avatar: Sad emoji with a smile mask on a face"
     src="./logo.png">
     
[![npm](https://img.shields.io/npm/v/@funboxteam/harold.svg)](https://www.npmjs.com/package/@funboxteam/harold)

**Harold** is a CLI tool that compares frontend project bundles in size.

[По-русски](./README.ru.md)

## Rationale

The bundle size of an average frontend project grows on every change. 

~~To feel the pain~~ To make it easier to measure & compare the project size while refactoring or updating the deps, 
we've built Harold.

## Demo

<img align="center"
     alt="Demo GIF"
     src="./demo.gif">
     
<small><i>The demo is accelerated. In real life setting up the dependencies and building a project takes forever.</i></small>

## Installation

```bash
npm install -g @funboxteam/harold
```

## Commands

### snapshot \[options\]

Builds the project and takes the snapshot.

Available options:

- `-o, --output <path>` — sets the snapshot output path; default is `harold_snapshot_<date>_<time>.json`;
- `-e, --exec <cmd>` — sets the building command; default is `npm run build-production`. The command will be run with
`NO_HASH=true` env variable set;
- `-p, --path <path>` — sets the path of the build result directory, which will be used for snapshotting; 
  default is `public`.

### diff \<left\> \<right\>

Compares the passed snapshots.

### help

Sends halp.

## FAQ

### How does it work?

When you take a snapshot, Harold runs the build command, waits until the project is building, then goes to the output 
directory and records the files' sizes. At the same time it creates the gzipped version of each file and records 
it's size too. After than it spits the snapshot — JSON file with all the data.

Then, when you have two snapshots and run `harold diff first.json second.json` it compares the diff files and prints
the overall comparison.

<details>
  <summary>Usage example</summary>

  ```bash
  # Open your project folder
  $ cd ~/my-syper-kewl-project/
  
  # Take the first snapshot
  $ harold snapshot -o before.json
  
  # Make some changes in the project
  
  # Take the second snapshot
  $ harold snapshot -o after.json
  
  # Compare them
  $ harold diff before.json after.json
  
  Snapshots:
   Left: 11/10/2020 6:30:56 PM • my-syper-kewl-project • master
   Right: 11/10/2020 6:45:13 PM • my-syper-kewl-project • improvement/framework-update
  
  Build time:
   16 seconds slower (Left: 129 seconds, Right: 145 seconds)
  
  Diff by category:
   ————————————————————————————————————————————————————————————————————————————————————
                  before              after               Changes
   ————————————————————————————————————————————————————————————————————————————————————
    JS            1.04 MB (270 kB)    1.12 MB (294 kB)    +78.2 kB (+23.7 kB), +1 item
   ————————————————————————————————————————————————————————————————————————————————————
    JS (legacy)   1.07 MB (285 kB)    1.16 MB (314 kB)    +90.6 kB (+28.6 kB), +1 item
   ————————————————————————————————————————————————————————————————————————————————————
    CSS           144 kB (23.4 kB)    144 kB (23.4 kB)    No changes
   ————————————————————————————————————————————————————————————————————————————————————
    Images        5.26 MB (5.23 MB)   5.26 MB (5.23 MB)   No changes
   ————————————————————————————————————————————————————————————————————————————————————
    Fonts         159 kB (159 kB)     159 kB (159 kB)     No changes
   ————————————————————————————————————————————————————————————————————————————————————
    Videos        1.59 MB (1.58 MB)   1.59 MB (1.58 MB)   No changes
   ————————————————————————————————————————————————————————————————————————————————————
    Other         127 kB (13.2 kB)    127 kB (13.3 kB)    +364 B (+82 B)
   ————————————————————————————————————————————————————————————————————————————————————
  
    Total         9.4 MB (7.56 MB)    9.57 MB (7.61 MB)   +169 kB (+52.4 kB), +2 items
   ————————————————————————————————————————————————————————————————————————————————————
  
  Diff by files:
   m public: +169 kB (+52.4 kB)
   m public/10.js: +16 B (+4 B)
   m public/11.js: -20 B (-3 B)
   + public/12.js: 301 B (143 B)
   m public/3.js: +1.84 kB (+621 B)
   m public/app.js: +4.18 kB (+843 B)
   m public/legacy.10.js: +42 B (+18 B)
   + public/legacy.12.js: 513 B (148 B)
   m public/legacy.3.js: +1.9 kB (+634 B)
   m public/legacy.app.js: +6.83 kB (+1 kB)
   m public/legacy.vendor.js: +81.3 kB (+26.8 kB)
   m public/legacy.vendor.js.LICENSE: +182 B (+41 B)
   m public/vendor.js: +72.2 kB (+22.1 kB)
   m public/vendor.js.LICENSE: +182 B (+41 B)
  ```
</details>

### What is `NO_HASH`?

Modern frontend bundlers may add hashes to the filenames to improve caching. But Harold compares files using
their names. To improve the diff quality you should set up your bundler the way that turns off hashes when `NO_HASH` set.

Or you may just provide another env variable if you need:

```bash
WITHOUT_CONTENTHASH=true harold snapshot
```

### How to make a snapshot without building a project?

Pass to `--exec` a fake command, such as `echo 1`.

### What is “JS (legacy)”?

Due to the variety of web browsers, nowadays frontenders have to support not only modern Chrome & Firefox, but also
old dusty IE or Presto-based Opera. To make it easier for users with modern browsers to download assets,
developers split the bundle on two parts: modern one & legacy one. The latter includes more polyfills, 
contains older JS syntax, etc. 

Harold expects that in the case of legacy bundle existence, its files will be named as `legacy.*.js`. If there are such 
files, their stat will appear in “JS (legacy)” row.   

## Credits

The avatar for the project was made by [Igor Garybaldi](http://pandabanda.com/).

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
