import React, {Component} from 'react'
import './left-nav.less'
import {NavLink,withRouter} from "react-router-dom";
import {Menu,Icon} from 'antd'

import logo from '../../assets/images/logo.png'
import MenuList from '../../config/menuConfig'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

class LeftNav extends Component {

    getMenuNodes = (menu) => {
        return menu.reduce((pre,item) => {
            if(item.children){
                const submenu = (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                    {
                        this.getMenuNodes(item.children)
                    }
                </SubMenu>
            )
                pre.push(submenu)

                const path = this.props.location.pathname
                const cItem = item.children.find(child => path.indexOf(child.key) === 0)
                if(cItem) {
                    this.openKey = item.key  //有子标签默认展开
                    this.selectKey = cItem.key // 有子标签且默认选中
                }

            }else {
                const menu = (
                    <Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon}/> {item.title}
                        </NavLink>
                    </Item>
                )
                pre.push(menu)

            }
            return pre
        },[])
    }

    componentWillMount() {
        this.menuNodes = this.getMenuNodes(MenuList)
        console.log(this.menuNodes);
    }
    render() {
        const path = this.selectKey || this.props.location.pathname
        console.log('path',path);
        return (
            <div className='left-nav'>
                <NavLink to='/home' className='logo'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </NavLink>
                <Menu mode="inline" theme='dark' defaultSelectedKeys={[path]} defaultOpenKeys={[this.openKey]}>
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

// 将一个非路由组件包装生成一个路由组件, 向非路由组件传递路由组件才有的3个属性: history/location/match
export default withRouter(LeftNav)