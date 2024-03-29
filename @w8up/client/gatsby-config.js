require('dotenv').config();

module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-theme-apollo',
    'gatsby-plugin-svgr',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/icon.svg'
      }
    },
    {
      resolve: 'gatsby-plugin-chakra-ui',
      options: {
        isUsingColorMode: false
      }
    },
    {
      resolve: 'gatsby-source-stripe',
      options: {
        objects: ['Plan'],
        secretKey: process.env.STRIPE_SECRET_KEY
      }
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: ['/app/*']
      }
    }
  ]
};
