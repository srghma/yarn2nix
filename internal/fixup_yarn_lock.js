#!/usr/bin/env node

/* Usage:
 * node fixup_yarn_lock.js yarn.lock
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const yarnLockPath = process.argv[2]

const readFile = readline.createInterface({
  input: fs.createReadStream(yarnLockPath, { encoding: 'utf8' }),

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  crlfDelay: Infinity,

  terminal: false, // input and output should be treated like a TTY
})

// Url examples:
// https://registry.yarnpkg.com/acorn-es7-plugin/-/acorn-es7-plugin-1.1.7.tgz
// https://registry.npmjs.org/acorn-es7-plugin/-/acorn-es7-plugin-1.1.7.tgz
// git+https://github.com/srghma/node-shell-quote.git
// git+https://1234user:1234pass@git.graphile.com/git/users/1234user/postgraphile-supporter.git
//
// Note:
// this function is duplicated at yarn2nix.js
function urlToName(url) {
  const isGitDep = url.startsWith('git+https://') || url.startsWith('git://')

  if (isGitDep) {
    return path.basename(url)
  }

  // transform
  // https://codeload.github.com/anmonteiro/nexe/tar.gz/142338ede69c3828c8a3c9fa7bacd4850762e4a1
  // to
  // anmonteiro_nexe_142338ede69c3828c8a3c9fa7bacd4850762e4a1
  if (url.startsWith('https://codeload.github.com/')) {
    const url_ = url
      .replace('https://codeload.github.com/', '') // prevents having long directory names
      .replace('tar.gz/', '')
      .replace(/[@/:-]/g, '_') // replace "@", "/", ":", "/" characters with underscore

    console.error('HERE', url_)
    return `${url_ }.tgz#142338ede69c3828c8a3c9fa7bacd4850762e4a1`
  }

  return url
    .replace('https://registry.yarnpkg.com/', '') // prevents having long directory names
    .replace(/[@/:-]/g, '_') // replace "@", "/", ":", "/" characters with underscore
}

const result = []

readFile
  .on('line', line => {
    const urlWithShaMatch = line.match(/^ {2}resolved "([^"]+)"$/)

    if (urlWithShaMatch === null) {
      result.push(line)
      return
    }

    const urlWithSha = urlWithShaMatch[1]

    const [url, maybeShaOrRev] = urlWithSha.split('#')

    const fileName = urlToName(url)

    const addShaOrRev = maybeShaOrRev ? `#${maybeShaOrRev}` : ''

    const newLine = `  resolved "${fileName}${addShaOrRev}"`

    console.log('HERE', urlWithSha, newLine)

    result.push(newLine)
  })
  .on('close', () => {
    fs.writeFile(yarnLockPath, result.join('\n'), 'utf8', err => {
      if (err) {
        console.error(
          'fixup_yarn_lock: fatal error when trying to write to yarn.lock',
          err,
        )
      }
    })
  })
