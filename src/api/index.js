//进一步封装ajax
//根据接口文档定义接口请求函数
import ajax from './ajax'
import jsonp from 'jsonp'

//登录请求
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
//添加用户请求
export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST')
//获取分类列表
export const reqCategroys = (parentId) => ajax('/manage/category/list',{parentId})
//添加分类列表
export const reqAddCategroy = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'POST')
//修改分类列表
export const reqUpdateCategroy = (categoryId,categoryName) => ajax('/manage/category/update',{categoryId,categoryName},'POST')
//获取指定页的商品列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})
//搜索商品
export const reqSearchProducts = ({pageNum,pageSize,searchType,searchName}) => ajax('/manage/product/search',{
    pageNum,pageSize,
    [searchType]:searchName
})
//删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//添加和编辑商品
export const reqAddUpdateCategory = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//获取天气请求
export function reqWeather (city) {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,
            {param:'callback'},
            (error,data) => {
                console.log('callback',error,data)
                if(!error) {
                    const{dayPictureUrl,weather} = data.results[0].weather_data[0]
                    resolve({dayPictureUrl,weather})
                }else {
                    alert('请求天气出错')
                }
            })
    })
}
