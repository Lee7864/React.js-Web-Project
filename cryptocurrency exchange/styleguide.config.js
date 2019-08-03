module.exports = {
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700'
        }
      ]
    }
  },
  theme: {
    fontFamily: {
      base: 'Roboto'
    }
  },
  sections: [
    {
      name: 'Controls',
      components: 'src/components/controls/*.js',
      exampleMode: 'expand',
      usageMode: 'expand'
    },
    {
      name: 'Containers',
      components: 'src/components/containers/*.js'
    },
    {
      name: 'Pages',
      components: 'src/components/pages/*.js'
    },
    {
      name: 'Cards',
      components: 'src/components/cards/*.js'
    }
  ]
}
