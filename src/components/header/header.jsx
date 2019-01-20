import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Row, Col, Modal} from 'antd'
import './header.less'
import MemoryUtils from '../../utils/MemoryUtils'
import {formateDate} from '../../utils/utils'
import {reqWeather} from '../../api/'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'


class Header extends Component {
    state = {
        sysTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    componentDidMount() {
        this.getSysTime()
        this.getWeather()

    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    getSysTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({
                sysTime:formateDate(Date.now())
            })
        },1000)
    }
    getWeather = async () => {
        const {dayPictureUrl,weather} = await reqWeather('邯郸')
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    logout = () => {
        Modal.confirm({
            content: '确认退出吗?',
            onOk:() => {
                console.log('OK');
                storageUtils.removeUser()
                MemoryUtils.user = {}
                this.props.history.replace('./login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    getTitle = (path) => {
        let title
        menuList.forEach(menu => {
            if(menu.key === path) {
                title = menu.title
            }else if(menu.children){
                menu.children.forEach(item => {
                    if(path.indexOf(item.key) === 0) {
                        title = item.title
                    }
                })
            }
        })
        return title
    }

    render() {
        const {sysTime,dayPictureUrl,weather} = this.state
        const user = MemoryUtils.user
        const path = this.props.location.pathname
        const title = this.getTitle(path)
        return (
            <div className='header'>
                <Row className='header-top'>
                    <Col span={24}>
                        <span>欢迎，{user.username}</span>
                        <a href="javascript:;" onClick={this.logout}>退出</a>
                    </Col>
                </Row>
                <Row className="breadcrumb">
                    <Col span={4} className="breadcrumb-title">
                        {title}
                    </Col>
                    <Col span={20} className="weather">
                        <span className="date">{sysTime}</span>
                        <span className="weather-img">
                           <img src={dayPictureUrl}/>
                        </span>
                        <span className="weather-detail">{weather}</span>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default withRouter(Header)