#!/usr/bin/env node
import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { setContext } from 'apollo-link-context';
import { table, getBorderCharacters } from 'table';
import relativeDate from 'relative-date';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function die(message) {
    console.error(message);
    process.exit(-1)
}

if (!GITHUB_TOKEN) {
    die("Set GITHUB_TOKEN to a GitHub personal access token https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/")
}

const authLink = setContext((_, { headers }) => {
    const token = GITHUB_TOKEN;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: 'https://api.github.com/graphql', fetch: fetch })),
    cache: new InMemoryCache(),
});

function comparator(fn) {
    return (a, b) => {
        const k1 = fn(a);
        const k2 = fn(b);
        return k1 < k2 ? 1 : k2 < k1 ? -1 : 0;
    }
}

function report(source) {
    const repos = [source, ...source.forks.nodes];
    if (source.parent) {
        repos.unshift(source.parent);
    }
    repos.sort(comparator(r => new Date(r.pushedAt)));
    repos.sort(comparator(r => r.stargazers.totalCount));
    const headers = ['Owner', 'Last Push  ', 'Stars', 'Issues', 'Pull Requests', 'Forks', 'Homepage'];
    const data = [headers];
    function totalstr(count) {
        if (count.hasOwnProperty('totalCount')) {
            count = count.totalCount;
        }
        return count > 0 ? count : '-';
    }
    for (let r of repos) {
        data.push([r.nameWithOwner.split('/')[0], relativeDate(new Date(r.pushedAt)), totalstr(r.stargazers), totalstr(r.issues), totalstr(r.pullRequests), totalstr(r.forks), r.url])
    }
    const config = {
        border: { ...getBorderCharacters('void'), joinBody: '─' },
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 1
        },
        columns: {
            1: { alignment: 'right' },
            2: { alignment: 'right' },
            3: { alignment: 'right' },
            4: { alignment: 'center', width: 10, wrapWord: true },
        },
        drawHorizontalLine: (index) => index == 1,
    };
    const output = table(data, config);
    console.log(output);
    const remaining = source.forks.totalCount - source.forks.nodes.length;
    if (remaining > 0) {
        console.info(`...and ${remaining} more.`)
    }
    if (source.parent) {
        const additionalForks = source.parent.forks.totalCount - 1;
        let suffix = '';
        if (additionalForks > 0) {
            suffix = `, which has ${additionalForks} additional forks (not shown)`;
        }
        console.info(`${source.nameWithOwner} is a fork of ${source.parent.nameWithOwner}${suffix}.`);
    }
}

const usage = `Usage: ${process.argv[1]} REPO`;
const args = process.argv.slice(2)
args.length == 1 || die(usage);

const repo_nwo = args[0].replace(/^https:\/\/github\.com\//, '');
repo_nwo.split('/').length == 2 || die(usage)

const repo_owner = repo_nwo.split('/')[0];
const repo_name = repo_nwo.split('/')[1];

const forksQuery = gql`
query {
    repository(owner: "${repo_owner}", name: "${repo_name}") {
        ...repoParts
        parent {
            ...repoParts
            forks { totalCount }
        }
        forks(first:30, orderBy:{field: STARGAZERS, direction: DESC}) {
            totalCount
            nodes {
                ...repoParts
                forks { totalCount }
            }
        }
    }
}
fragment repoParts on Repository {
    issues { totalCount }
    stargazers { totalCount }
    pullRequests { totalCount }
    url
    nameWithOwner
    pushedAt
}
`;

client.query({
    query: forksQuery,
    variables: { repo_owner, repo_name },
})
    .then(({ data }) => report(data.repository))
    .catch(error => die(error.message || error));
