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
$ babel-node index.js babel/babel
Owner                Last Push   Stars Issues    Pull     Homepage
                                               Requests
─────────────────────────────────────────────────────────────────────────────────────────────────────
babel             13 minutes ago 24196   4515    2353     https://github.com/babel/babel
thejameskyle        8 months ago     5      -     -      https://github.com/thejameskyle/bbl
gilbert              2 years ago     4      -     -      https://github.com/gilbert/babel
github                a year ago     3      -     -      https://github.com/github/babel
VukDukic             2 years ago     2      -     -      https://github.com/VukDukic/babel
guybedford          8 months ago     2      -     -      https://github.com/guybedford/babel
TNChalise            2 weeks ago     1      -     -      https://github.com/TNChalise/babel
varunjha089         2 months ago     1      -     -      https://github.com/varunjha089/babel
rabeesh             4 months ago     1      -     -      https://github.com/rabeesh/babel
Adam8989            4 months ago     1      -     -      https://github.com/Adam8989/babel
happyshi0402        5 months ago     1      -     -      https://github.com/happyshi0402/babel
letsila             5 months ago     1      -     -      https://github.com/letsila/babel
xiongshengzhong     6 months ago     1      -     -      https://github.com/xiongshengzhong/babel
lelander            8 months ago     1      -     -      https://github.com/lelander/babel
lingsamuel          9 months ago     1      -     -      https://github.com/lingsamuel/babel
maikahj            10 months ago     1      -     -      https://github.com/maikahj/babel
pbangelly          11 months ago     1      -     -      https://github.com/pbangelly/babel
ZhangYuTing98      11 months ago     1      -     -      https://github.com/ZhangYuTing98/babel
kubikrubit         12 months ago     1      -     -      https://github.com/kubikrubit/babel
callmevlad            a year ago     1      -     -      https://github.com/callmevlad/babel
psaren                a year ago     1      -     -      https://github.com/psaren/babel
NodeJSDevelopment     a year ago     1      -     -      https://github.com/NodeJSDevelopment/babel
ryb73              10 months ago     1      -     -      https://github.com/ryb73/babel
jchip                 a year ago     1      -     -      https://github.com/jchip/babel
wjw905266             a year ago     1      -     -      https://github.com/wjw905266/babel
yyx990803             a year ago     1      -     -      https://github.com/yyx990803/babel
hellocy              2 years ago     1      -     -      https://github.com/hellocy/babel
dev-masonfrye        2 years ago     1      -     -      https://github.com/dev-masonfrye/babel
Hoby8080             2 years ago     1      -     -      https://github.com/Hoby8080/babel
doug-wade             a year ago     1      -     -      https://github.com/doug-wade/babel
xiao2mo              2 years ago     1      -     -      https://github.com/xiao2mo/babel

...and 2161 more.
```

## LICENSE

MIT
