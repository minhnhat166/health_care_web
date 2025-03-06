import { jwtDecode } from 'jwt-decode'

function decodeJwt(token: string) {
    const decodedToken = jwtDecode(token)
    return decodedToken
}

export default decodeJwt
