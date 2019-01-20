import React, {Component} from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import ProductIndex from './index'
import ProductSaveUpdate from './saveUpdate'
import ProductDetail from './detail'
import './product.less'
/*
管理的商品管理路由组件
 */
export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/product/index' component={ProductIndex}/>
          <Route path='/product/saveupdate' component={ProductSaveUpdate}/>
          <Route path='/product/detail' component={ProductDetail}/>
          <Redirect to='/product/index'/>
        </Switch>

      </div>
    )
  }
}