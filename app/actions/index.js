let nextTodoId = 0;
export const login = (id,pw) => ({
    type: 'LOGIN',
    id,
    pw
})
export const closeloading = ()=> ({
    type: 'CLOSELOADING',
})
export const draw = (operation) => ({
    type: 'DRAW',
    operation
})
export const erase = (operation) => ({
    type: 'ERASE',
    operation
})
export const gameFinish = () => ({
    type: 'GAMEFINISH'
})
export const gameLock = () => ({
    type: 'GAMELOCK'
})
export const gameMuic = () => ({
    type: 'GAMEMUSIC'
})
export const titleTop = (scrollTop,toyTop,toyX,currentSelect) => {
    return {
        type: 'TITLETOP',
        scrollTop,
        toyTop,
        toyX,
        currentSelect
    }
}