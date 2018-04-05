import store from 'store';

const USER = 'user';

export default {
    get() {
        return store.get(USER)
    },
    login(user) {
        store.set(USER, user)
    },
    logout() {
        store.remove(USER)
    },
    loggedIn() {
        return !!store.get(USER)
    }
}
