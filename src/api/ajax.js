/*
* 用来发送ajax请求的函数模块
内部封装axios
*/

import axios from 'axios'
import {message} from 'antd'

//axios函数的返回值为promise对象
export default function ajax(url, data={}, method='GET') {
    return new Promise((resolve,reject) => {
        let promise
        if(method === 'GET') {
            promise = axios.get(url,{params:data})
        }else {
            promise = axios.post(url,data)
        }
        promise.then(responed => {
            resolve(responed.data)
            }
        ).catch(error => {
            console.log(url,error);
            message.error('请求出错')
            }
        )
    })

}