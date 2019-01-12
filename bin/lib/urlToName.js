const path = require('path')

// String -> String

// Note:
// this function is duplicated at fixup_yarn_lock.js

// @url examples:
// - https://registry.yarnpkg.com/acorn-es7-plugin/-/acorn-es7-plugin-1.1.7.tgz
// - https://registry.npmjs.org/acorn-es7-plugin/-/acorn-es7-plugin-1.1.7.tgz
// - git+https://github.com/srghma/node-shell-quote.git
// - git+https://1234user:1234pass@git.graphile.com/git/users/1234user/postgraphile-supporter.git

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
    return path.basename(url)
  }

  return url
    .replace('https://registry.yarnpkg.com/', '') // prevents having long directory names
    .replace(/[@/:-]/g, '_') // replace "@", "/", ":", "/" characters with underscore
}

module.exports = urlToName
