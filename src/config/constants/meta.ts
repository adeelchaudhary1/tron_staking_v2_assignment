import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Tron Assignment',
  description: 'Tron Assignment',
  image: '',
}

export const getCustomMeta = (path: string): PageMeta => {
  let basePath
  if (path.startsWith('/home')) {
    basePath = '/home'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `Home`,
      }
    default:
      return null
  }
}
