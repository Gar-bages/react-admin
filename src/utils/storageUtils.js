import store from 'store'

const User_Key = 'user_key'

function setItem(name,value) {
    if(value && typeof value !=='function') {
        store.set(name,value)
    }else {
        alert('不支持此类型数据存储')
    }
}

function getItem(name) {
    return store.get(name) || ''
}

function removeItem(name) {
    store.remove(name)
}
export default {
    saveUser(user) {
        setItem(User_Key,user)
    },
    getUser() {
        return getItem(User_Key)
    },
    removeUser() {
        removeItem(User_Key)
    }

}