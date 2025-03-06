import sha256 from 'js-crypto-hash'

const encrypt = async (input: string) => {
    try {
        // First hash
        const dataEncoded = new TextEncoder().encode(input)
        const hashedBytes = await sha256.compute(dataEncoded)
        const hash = btoa(String.fromCharCode(...new Uint8Array(hashedBytes)))

        // Second hash
        const secondDataEncoded = new TextEncoder().encode(hash)
        const secondHashedBytes = await sha256.compute(secondDataEncoded)
        return btoa(String.fromCharCode(...new Uint8Array(secondHashedBytes)))
    } catch (error) {
        console.error('Encryption failed:', error)
        return null
    }
}

export default encrypt
