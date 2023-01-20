

// 处理 本地存储 api

export const setItem = (key,value)=> {
    if(typeof value === "object"){
        value = JSON.stringify(value)
    }
    localStorage.setItem(key,value)
}

export const getItem = key=> {

    const data = localStorage.getItem(key)
    try{
        return JSON.parse(data)
    }catch{
        return data
    }
}


export const setItemSession = (key,value)=> {
    if(typeof value === "object"){
        value = JSON.stringify(value)
    }

    sessionStorage.setItem(key,value)
}

export const getItemSession = key => {

    const data = sessionStorage.getItem(key)
    try{
        return JSON.parse(data)
    }catch{
        return data
    }
}


export const removeItem = key => localStorage.removeItem(key)

