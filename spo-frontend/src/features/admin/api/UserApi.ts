import { api } from '../../../shared/api/client'

export async function getUsers() {
  try {
    const users = await api.get('/users')
    return users
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getUser(userId: number) {
  try {
    const userInfo = await api.get(`/users/${userId}`)
    return userInfo
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function addUser(name: string, password: string) {
  try {
    const data = { name, password }
    const response = await api.post('/users', data)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
