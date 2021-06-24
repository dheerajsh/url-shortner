import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '@config': `${__dirname}/config`,
  '@logger': `${__dirname}/logger`,
  '@modules': `${__dirname}/modules`,
  '@utils': `${__dirname}/utils`,
})
