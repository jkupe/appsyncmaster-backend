const http = require('axios')
const _ = require('lodash')

const throwOnError = ({ query, variables, errors }) => {
  if (errors) {
    const errorMessage = `
    query: ${query}
    variables: ${JSON.stringify(variables, null, 2)}
    errors: ${JSON.stringify(errors, null, 2)}
    `
    throw new Error(errorMessage)
  }
}

module.exports = async (url, query, variables = {}, auth) => {
  const headers = {}
  if (auth) {
    headers.Authorization = auth
  }

  try {
    const res = await http({
      url,
      method: 'post',
      headers,
      data: {
        query,
        variables: JSON.stringify(variables)
      }
    })
    
    const { data, errors } = res.data
    throwOnError({query, variables, errors})
    return data

  } catch (err) {
    const errors = _.get(err, 'response.data.errors')
    throwOnError({query, variables, errors})
    throw err
  }


}
