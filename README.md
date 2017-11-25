# Forkmantle
[![NPM version](http://img.shields.io/npm/v/forkmantle.svg?style=flat)](https://www.npmjs.com/package/forkmantle)

`forkmantle` displays GitHub forks and their stats.

It's intended to help identify the living successors to abandoned GitHub repos.

## Install

1. Install: `npm install -g forkmantle`
2. Set the `GITHUB_TOKEN` environment variable to a [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).
(If you've been using other GitHub command-line tools, you may already have this.)

## Usage

```
$ babel-node index.js urfave/cli
Owner                Last Push   Stars Issues    Pull     Forks Homepage
                                               Requests
───────────────────────────────────────────────────────────────────────────────────────────────────────────
urfave                 yesterday  6872    296    390     596   https://github.com/urfave/cli
minio               5 months ago    10      -     2      9     https://github.com/minio/cli
keybase              2 weeks ago     7      -     4      -     https://github.com/keybase/cli
micro              10 months ago     4      -     -      2     https://github.com/micro/cli
AudriusButkevicius   3 years ago     2      -     -      -     https://github.com/AudriusButkevicius/cli
wercker              3 years ago     2      -     -      -     https://github.com/wercker/codegangsta-cli
oiooj                2 years ago     2      -     1      1     https://github.com/oiooj/cli
henrylee2cn         4 months ago     2      -     -      1     https://github.com/henrylee2cn/cli
wsxiaozhang          3 years ago     1      -     -      -     https://github.com/wsxiaozhang/cli
golib                 a year ago     1      -     -      -     https://github.com/golib/cli
qijianbo010        10 months ago     1      -     -      -     https://github.com/qijianbo010/cli
evandbrown           2 years ago     1      -     -      -     https://github.com/evandbrown/cli
zenoss               a month ago     1      -     4      1     https://github.com/zenoss/cli
murdinc             9 months ago     1      -     -      -     https://github.com/murdinc/cli
dkolbly             7 months ago     1      -     1      -     https://github.com/dkolbly/cli
dutchcoders          2 years ago     1      -     -      -     https://github.com/dutchcoders/cli
piaoyunsoft         3 months ago     1      -     -      -     https://github.com/piaoyunsoft/cli-1
yekeqiang            4 years ago     1      -     -      -     https://github.com/yekeqiang/cli
laprasdrum           2 weeks ago     -      -     -      -     https://github.com/laprasdrum/cli
baude                  yesterday     -      -     -      -     https://github.com/baude/cli
jonnycrunch          a month ago     -      -     -      -     https://github.com/jonnycrunch/cli-1
layeka               4 weeks ago     -      -     -      -     https://github.com/layeka/cli
ganyaotong           3 weeks ago     -      -     -      -     https://github.com/ganyaotong/cli
imagehongyao         3 weeks ago     -      -     -      -     https://github.com/imagehongyao/cli
carolynhu            a month ago     -      -     -      -     https://github.com/carolynhu/cli-1
osleg                 a week ago     -      -     -      -     https://github.com/osleg/cli
rafroehlich2          a week ago     -      -     -      -     https://github.com/rafroehlich2/cli
Stretch96             a week ago     -      -     -      -     https://github.com/Stretch96/cli
melindabernrdo        a week ago     -      -     -      -     https://github.com/melindabernrdo/cli
tfogo                 6 days ago     -      -     -      -     https://github.com/tfogo/cli
zhanglei             a month ago     -      -     -      -     https://github.com/zhanglei/cli

...and 566 more.
```

## API

```javascript
import { query } from 'forkmantle';

query('urfave/cli')
    .then(console.info(repo))
```

The `GITHUB_TOKEN` environment variable must be set when the module is imported.

## LICENSE

MIT
