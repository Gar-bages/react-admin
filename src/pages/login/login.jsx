import React, {Component} from 'react'
import {Form,Button,Icon,Input} from 'antd'
import PropTypes from 'prop-types'
import logo from '../../assets/images/logo.png'
import './login.less'
import {reqLogin} from '../../api/index'
import storageUtils from '../../utils/storageUtils'
import MemoryUtils from '../../utils/MemoryUtils'

export default class Login extends Component {

    state = {
        errorMsg:''
    }

    login = async (username,password) => {
        const result = await reqLogin(username,password)
        if(result.status === 0) {
            //请求成功得到用户信息
            const user  = result.data
            //保存user
            storageUtils.saveUser(user)
            MemoryUtils.user = user
            //成功后进入admin界面
            this.props.history.replace('/')
        }else {
            this.setState({
                errorMsg:result.msg
            })
        }
    }

    render() {
        const {errorMsg} = this.state
        return (
            <div className='login'>
                <div className='login-header'>
                    <img src={logo} alt='logo'/>
                    React项目：后台管理系统
                </div>
                <div className='login-content'>
                    <div className='login-box'>
                        <div className="error-msg-wrap">
                            <div className={errorMsg ? "show" : ""}>
                                {errorMsg}
                            </div>
                        </div>

                        <div className='title'>用户登录</div>
                        <LoginForm login={this.login}/>
                    </div>
                </div>
            </div>
        )
    }
}

//被包装的组件
class LoginForm extends Component{
    static propsType = {
        login:PropTypes.func.isRequired
    }
    clickLogin = () => {
        //对所有表单进行验证
        this.props.form.validateFields(async (error,values) => {
            //如果所有表单都正确 就收集并打印所有数据
            if(!error) {
                console.log('validateFields',values);
                const {username,password} = values
                this.props.login(username,password)
            }else{
                //如果有表单不正确 就重置
                // this.props.form.resetFields()
            }
        })
    }
    //验证密码
    checkPassword = (rule,value,callback) => {
        if(!value) {
            callback('必须输入密码')
        }else if(value.length<4 || value.length>8) {
            callback('密码不能少于4位多于8位')
        }else {
            callback()
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return(
            <Form className='login-form'>
                <Form.Item>
                    {getFieldDecorator('username',{
                        initialValue:'admin',
                        rules:[
                            {type:'string',required:true,message:'必须输入用户名'},
                            {min:4,message:'用户名不能少于四位'}
                        ],
                    })
                    (<Input prefix={<Icon type="user"/>}/>)
                    }

                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password',{
                        rules: [{validator:this.checkPassword}]
                    })
                    (<Input type='password' prefix={<Icon type="lock"/>}/>)
                    }
                </Form.Item>
                <Form.Item>
                    <Button type='primary' className='login-form-button' onClick={this.clickLogin} >登录</Button>
                </Form.Item>
            </Form>
        )
    }
}

//包装包含<Form>的组件 生成一个新的组件（包装组件）
//包装组件会向被包装组件传一个form属性
LoginForm = Form.create()(LoginForm)