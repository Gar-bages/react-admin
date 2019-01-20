//添加产品和修改产品页面
import React, {Component} from 'react'
import {Input,Select,Button,Icon,Form,message} from 'antd'

import RichTextEditor from './rich-text-editor'
import {reqCategroys,reqAddUpdateCategory} from '../../api'
import PicturesWall from './pictureswall'

const Option = Select.Option
const Item = Form.Item
class ProductSaveUpdate extends Component {

    state = {
        categorys:[], //一级列表的数组
        subCategorys:[] //二级列表的数组
    }
    getCategorys = async (parentId) => {
        const result = await reqCategroys(parentId)
        if(result.status === 0) {
            const categorys = result.data
            if(parentId === '0') {
                this.setState({
                    categorys
                })
            }else {
                this.setState({
                    subCategorys:categorys
                })
            }
        }
    }

    //根据状态数组遍历出当前分类下所有分类列表
    getOptions = () => {
        const {categorys,subCategorys} = this.state
        //一级下所有分类列表
        const options = categorys.map(c => (
            <Option key={c._id} value={c._id}>{c.name}</Option>
        ))
        //当前一级下的所有二级分类列表
        const subOptions = subCategorys.map(c => (
            <Option key={c._id} value={c._id}>{c.name}</Option>
        ))
        return {options,subOptions}
    }

    //当option改变的时候 需要重新获取改变后option下的二级列表
    ShowSubCategory = (parentId) => {
        const product = this.props.location.state || {}
        //第一个框值改变 需要把第二个框值清空  不然还会显示之前那个一级列表下的二级分类
        product.categoryId = ''
        this.getCategorys(parentId)
    }

    //点击提交
    submit = async () => {
        //获取所有输入input框的相关值
        const {name, desc, price, category1, category2} = this.props.form.getFieldsValue()
        console.log('value',name, desc, price, category1, category2 )
        let pCategoryId, categoryId
        //如果第二个框没有值或未选择 说明是商品是一级列表下的 或 将要把商品添加到一级类别下
        if(!category2 || category2 === '未选择') {
            pCategoryId = '0'
            categoryId = category1
        // 第二个框有值 说明商品是二级列表下的
        }else {
            pCategoryId = category1
            categoryId = category2
        }
        //获取富文本内容 （标签对象就是组件对象）
        const detail = this.refs.editor.getContent()
        //获取所有上传图片信息的数组
        const imgs = this.refs.imgs.getImgs()

        const product = {name, desc, price, pCategoryId, categoryId, detail, imgs}
        const P = this.props.location.state
        //如果P有值 说明是编辑商品界面 知道产品的_id
        if(P) {
            product._id = P._id
        }
        const result = await reqAddUpdateCategory(product)
        console.log('result',result)
        if(result.status === 0) {
            message.success('商品保存成功')
            this.props.history.replace('/product/index')
        }else {
            message.error('商品保存失败')
        }
        // console.log('values',values,detail,imgs);
    }

    componentDidMount () {
        //第一次页面渲染完后就获取一级列表
        this.getCategorys('0')
        //当修改商品的时候 且商品所属分类是二级分类(pCategoryId不是0), 就需要去获取二级分类列表
        const product = this.props.location.state
        if(product && product.pCategoryId !== '0') {
            this.getCategorys(product.pCategoryId)
        }
    }

    render() {
        const {options,subOptions} = this.getOptions()
        //当修改的时候需要知道产品信息  ||  而添加的时候不需要product就没有值
        const product = this.props.location.state || {}
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 12},
        }
        let initialValue1 = '未选择'
        let initialValue2 = '未选择'
        // "categoryId": "5c3ff9143c769f2774de037c",
        //  "pCategoryId": "0",
        //当商品的pCategoryId=0 说明商品只添加到了一级分类列表下 只显示第一个选择框的默认值
        if(product.pCategoryId === '0') {
            initialValue1 = product.categoryId
        //当商品的pCategoryId不为0 说明商品添加到当前显示一级分类列表所属的二级分类列表下 就显示两个选择框的默认值
        }else if (product.pCategoryId) {
            initialValue1 = product.pCategoryId
            initialValue2 = product.categoryId || '未选择'
        }
            return (
            <div>
                <h1>
                    <a href='javascript:' onClick={() => this.props.history.goBack()}>
                        <Icon type='arrow-left'/>
                    </a>
                    &nbsp;&nbsp;
                    {product._id ? '编辑商品' : '添加商品'}
                </h1>
                <Form>
                    <Item label='商品名称' {...formItemLayout}>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name
                            })(
                                <Input placeholder='请输入商品名称'/>
                            )
                        }
                    </Item>

                    <Item label='商品描述' {...formItemLayout}>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc
                            })(
                                <Input placeholder='请输入商品描述'/>
                            )
                        }
                    </Item>

                    <Item label='商品价格' labelCol={{span: 2}} wrapperCol={{span: 6}}>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price
                            })(
                                <Input placeholder='请输入商品价格' addonAfter='元'/>
                            )
                        }
                    </Item>

                    <Item label='所属分类' {...formItemLayout}>
                        {
                            options.length > 0 ?
                            getFieldDecorator('category1', {
                                initialValue: initialValue1
                            })(
                                <Select style={{width:160}} onChange={value => this.ShowSubCategory(value)} >
                                    {options}
                                </Select>
                            ) : null
                        }
                        &nbsp;&nbsp;&nbsp;
                        {
                            subOptions.length > 0 ?
                            getFieldDecorator('category2', {
                                initialValue: initialValue2
                            })(
                                <Select style={{width:160}}>
                                    {subOptions}
                                </Select>
                            ) : null
                        }
                    </Item>

                    <Item label='商品图片' {...formItemLayout}>
                        <PicturesWall imgs={product.imgs} ref='imgs'/>
                    </Item>

                    <Item label='商品详情' labelCol={{span: 2}}
                          wrapperCol={{span: 20}} >
                        <RichTextEditor ref='editor' detail={product.detail}/>
                    </Item>
                </Form>
                <Button type='primary' onClick={this.submit}>提交</Button>
            </div>
        )
    }
}

export default Form.create()(ProductSaveUpdate)