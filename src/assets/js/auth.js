import store from 'store';

const TOKEN = 'token';

export default {
    get() {
        return {
            [TOKEN]: store.get(TOKEN)
        }
    },
    login({token}) {
        store.set(TOKEN, token)
    },
    logout() {
        store.remove(TOKEN)
    },
    loggedIn() {
        return !!store.get(TOKEN)
    }
}
