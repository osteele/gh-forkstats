#!/usr/bin/env node

/// <reference path = "ambient.d.ts" />

import { getBorderCharacters, table } from 'table';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import gql from 'graphql-tag';
import relativeDate from 'relative-date';
import { setContext } from 'apollo-link-context';
import yargs from 'yargs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function die(message: string) {
  console.error(message);
  process.exit(-1);
}

if (process.env.NODE_ENV !== 'test' && !GITHUB_TOKEN) {
  die(
    'Set GITHUB_TOKEN to a GitHub personal access token https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/'
  );
}

const authLink = setContext((_, { headers }) => {
  const token = GITHUB_TOKEN;
  return token
    ? {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      }
    : headers;
});

const client = new ApolloClient({
  link: authLink.concat(
    createHttpLink({ uri: 'https://api.github.com/graphql', fetch: fetch })
  ),
  cache: new InMemoryCache(),
});

// Returns a function suitable for use in `sort` that sorts by a projection function.
// If the function returns objects with a `totalCount` property, sort by this instead.
// This is useful with GraphQL relationships.
export function comparator<T, U extends number | object>(
  fn: (x: T) => U
): (a: T, b: T) => -1 | 0 | 1 {
  return (a, b) => {
    let k1 = fn(a);
    let k2 = fn(b);
    if (k1.hasOwnProperty('totalCount')) {
      k1 = (k1 as any).totalCount;
      k2 = (k2 as any).totalCount;
    }
    return k1 < k2 ? -1 : k2 < k1 ? 1 : 0;
  };
}

type Repo = {
  forks: {
    nodes: string | any[];
    totalCount: number;
  };
  parent: {
    forks: {
      totalCount: number;
    };
    nameWithOwner: any;
  };
  nameWithOwner: any;
};

function report(source: Repo) {
  const repos = [source, ...source.forks.nodes];
  if (source.parent) {
    repos.unshift(source.parent);
  }
  repos.sort(comparator(r => new Date(r.pushedAt)));
  repos.sort(comparator(r => r.stargazers));
  repos.reverse();
  const headers = [
    'Owner',
    'Last Push  ',
    'Stars',
    'Issues',
    'Pull Requests',
    'Forks',
    'Homepage',
  ];
  const data = [headers];
  function totalStr(count: number | { totalCount: number }) {
    if (count.hasOwnProperty('totalCount')) {
      count = (count as any).totalCount;
    }
    return count > 0 ? count : '-';
  }
  for (let r of repos) {
    data.push([
      r.nameWithOwner.split('/')[0],
      relativeDate(new Date(r.pushedAt)),
      totalStr(r.stargazers),
      totalStr(r.issues),
      totalStr(r.pullRequests),
      totalStr(r.forks),
      r.url,
    ]);
  }
  const config = {
    border: { ...getBorderCharacters('void'), joinBody: '─' },
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 1,
    },
    columns: {
      1: { alignment: 'right' },
      2: { alignment: 'right' },
      3: { alignment: 'right' },
      4: { alignment: 'center', width: 10, wrapWord: true },
    },
    drawHorizontalLine: (index: number) => index === 1,
  };
  const output = table(data, config);
  console.log(output);
  const remaining = source.forks.totalCount - source.forks.nodes.length;
  if (remaining > 0) {
    console.info(`...and ${remaining} more.`);
  }
  if (source.parent) {
    const additionalForks = source.parent.forks.totalCount - 1;
    let suffix = '';
    if (additionalForks > 0) {
      suffix = `, which has ${additionalForks} additional forks (not shown)`;
    }
    console.info(
      `${source.nameWithOwner} is a fork of ${source.parent.nameWithOwner}${suffix}.`
    );
  }
}

const FORKS_QUERY = gql`
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      ...repoInfo
      parent {
        ...repoInfo
        forks {
          totalCount
        }
      }
      forks(first: 30, orderBy: { field: STARGAZERS, direction: DESC }) {
        totalCount
        nodes {
          ...repoInfo
          forks {
            totalCount
          }
        }
      }
    }
  }
  fragment repoInfo on Repository {
    issues {
      totalCount
    }
    stargazers {
      totalCount
    }
    pullRequests {
      totalCount
    }
    url
    nameWithOwner
    pushedAt
  }
`;

class InvalidNameWithOwner extends Error {}

export async function query(nwo: string) {
  if (nwo.split('/').length !== 2) {
    throw new InvalidNameWithOwner(`Invalid repository name/owner: ${nwo}`);
  }
  const owner = nwo.split('/')[0];
  const name = nwo.split('/')[1];
  return client
    .query({
      query: FORKS_QUERY,
      variables: { owner, name },
    })
    .then(({ data }) => data.repository);
}

async function main() {
  const NWO_KEY = 'OWNER/REPO';
  const argv = (await Promise.resolve(
    yargs.usage(`$0 ${NWO_KEY}`, 'Print info about forks').argv
  )) as { [x: string]: string | undefined };
  const nwo = argv[NWO_KEY]!.replace(/^https:\/\/github\.com\//, '');

  try {
    const data = await query(nwo);
    report(data);
  } catch (e) {
    die(e.message || e);
  }
}

if (require.main === module) {
  main();
}
