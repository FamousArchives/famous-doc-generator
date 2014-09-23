module.exports = [
  '# <%= name %>', '\n',
  '<% if (typeof description != \'undefined\') { %>', 
    '### Description', '\n',
    '<%= description %>','\n',
  '<% } %>',

  '<% if (typeof params != \'undefined\') { %>', 

    '### Arguments', '\n',
  
    '<% _.each(params, function (param) { %>',
      // name
      '<% if (typeof param.name !== \'undefined\') { %>',
          '##### <%= param.name %>', '\n',
      '<% } %>',

      '<% if (param.props && param.props.length > 0) { %>',
        '\n\n',
        'Param | Type | Default | Description', '\n',
        '------ | ------ | ------------ | -----', '\n',
      '<% } %>',
      
      '<% _.each( param.props, function (prop) { %>',
        '<% if (prop.name) { %>', 
          '<%= prop.name %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        ' | ',

        '<% if (prop.type) { %>', 
          '<%= prop.type %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        ' | ',

        '<% if (prop.optdefault) { %>', 
          '<%= prop.optdefault %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        ' | ',
        

        '<% if (prop.description) { %>', 
          '<%= prop.description %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        '\n',
      '<% }); %>',
      '\n',
    '<% }); %>',
  '<% } %>',

  '### Methods', '\n',

  '<% _.each( classitems, function (item) { %>',
    '<% if (item.access == \'private\' || (!item.params && !item.name && !item.returns && !item.description)) return; %>',

    '<% if (item.params) { %>',
      '<% var paramString = "("; %>',
      '<% var paramLength = item.params.length; %>',
      '<% _.each( item.params, function (param, index) { %>',
        '<% paramString += param.name %>',
        '<% if (index !== paramLength - 1) { %>',
          '<% paramString += \', \'; %>',
        '<% } %>',
      '<% }); %>',
      '<% paramString += \')\'; %>',

    '<% } else { %>',
      '<% var paramString = \'()\'; %>', '\n',
    '<% } %>',

    '<% if (item.name) { %>', 
      '#### <%= item.name %> <%= paramString %>', '\n',
      '<% if (item.static == 1) { %>',
        '_static_', '\n',
      '<% } %>',
    '<% } %>',

    '<% if (item.description) { %>', 
      '<%= item.description %>', '\n\n',
    '<% } %>',
    

    '<% if (item.params) { %>', 
      '\n',
      'Param | Type | Description', '\n',
      '------ | ------ | ------------', '\n',
      '<% _.each( item.params, function (param) { %>',

        '<% if (param.name) { %>', 
          '<%= param.name %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        ' | ',

        '<% if (param.type) { %>', 
          '<%= param.type %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        ' | ',

        '<% if (param.description) { %>', 
          '<%= param.description %>',
        '<% } else { %>', 
          ' ', 
        '<% } %>',
        '\n',
      '<% }); %>',
      '\n',
    '<% } %>',


    // RETURNS
    '<% if (item.return && (item.return.type || item.return.description)) { %>', 
      '##### Returns\n\n',
      'Type | Description', '\n',
      '------ | ------------', '\n',

      '<% if (item.return.type) { %>', 
        '<%= item.return.type %>',
      '<% } else { %>', 
        ' ', 
      '<% } %>',
      ' | ',

      '<% if (item.return.description ) { %>', 
        '<%= item.return.description %>',
      '<% } else { %>', 
        ' ', 
      '<% } %>',
      '\n\n',
    '<% } %>',
    '----', '\n',
  '<% }); %>',
].join('');
