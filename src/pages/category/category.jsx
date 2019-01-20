import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card,Button,Icon,Table,Modal,Form,Select,Input,message} from 'antd'
import {reqCategroys,reqAddCategroy,reqUpdateCategroy} from '../../api'
/*
管理的分类管理路由组件
 */
const Item = Form.Item
const Option = Select.Option

//父组件
export default class Category extends Component {

  state = {
      parentId:'0',
      parentName:'',
      categorys:[],
      subCategorys:[],
      isShowAdd:false,
      isShowUpdate:false
  }

  //获取一/二级分类列表
    //pId: 如果有值使用它, 如果没有值使用state中的parentId
    getCategorys = async (pId) => {
      const parentId = pId || this.state.parentId
      const result = await reqCategroys(parentId)
      console.log(result);
        if(result.status === 0) {
          const categorys = result.data
          // console.log(categorys);
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

    //添加分类
    addCategory = async () => {
      this.setState({
          isShowAdd:false
      })
      const {parentId,categoryName} = this.form.getFieldsValue()
      this.form.resetFields()
      const result = await reqAddCategroy(parentId,categoryName)
      if(result.status === 0) {
          message.success('添加成功')
          //添加分类列表的父id=当前显示列表的父id  或者  添加分类列表的父id=0  都需要重新发送请求获取新数据
          if(parentId === this.state.parentId || parentId === '0') {
              this.getCategorys(parentId)
          }
      }
    }
    //传参可以知道要修改哪个分类
    showUpdate = (category) => {
      this.category = category
      this.setState({
          isShowUpdate:true
      })
    }
    //修改分类
    updateCategory = async () => {
        this.setState({
            isShowUpdate:false
        })
      //收集数据
        const categoryId = this.category._id
        const categoryName = this.form.getFieldValue('categoryName')
        const result = await reqUpdateCategroy(categoryId,categoryName)
        this.form.resetFields()
        if(result.status === 0) {
            message.success('更新成功')
            this.getCategorys()
        }
    }

    //显示二级分类列表
    showSubCategorys = (category) => {
      //setState()是异步更新的状态: 状态数据并不会立即更新, 而是回调处理完后才去更新
      this.setState(
          {
          //当前显示列表的父id和name
          parentId:category._id,
          parentName:category.name
          },
          () => { //回调函数在状态更新之后立即执行
              this.getCategorys()
          }
      )
    }

    //显示一级分类列表
    showCategorys = () => {
      this.setState({
          parentId:'0',
          parentName:'',
          subCategorys:[]
      })
    }

  componentWillMount() {
      this.columns = [{
          title: '分类名称',
          dataIndex: 'name',
          // render: text => <a href="javascript:;">{text}</a>,
      }, {
          title: '操作',
          width:300,
          render: (category) => {
              return (
                  <span>
                  <a href='javascript:' onClick={() => this.showUpdate(category)}>修改分类</a>
                      &nbsp;&nbsp;&nbsp;
                      <a href='javascript:' onClick={() => this.showSubCategorys(category)}>查看子分类</a>
                </span>
              )
          }
      }];
  }

  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const {parentId,categorys,subCategorys,parentName,isShowAdd,isShowUpdate} = this.state
    const columns = this.columns
    //显示修改框里得到 在第一次渲染时没有  点链接的时候才有
    const category = this.category || {}
     return (
      <div>
          <Card>
              {
                parentId === '0' ? <span style={{fontSize:20}}>一级分类列表</span> : (
                    <span>
                        <a href='javascript:' onClick={this.showCategorys}>一级分类</a>
                        &nbsp;&nbsp;
                        <Icon type='arrow-right'/>
                        &nbsp;&nbsp;
                        <span>{parentName}</span>
                    </span>
                )
              }

              <Button type='primary' style={{float:'right'}} onClick={() => this.setState({isShowAdd:true})}>
                  <Icon type='plus'/>添加分类
              </Button>
          </Card>
          <Table
            columns={columns}
            bordered
            dataSource={parentId === '0' ? categorys : subCategorys}
            rowKey='_id'
            pagination={{defaultPageSize:6,showQuickJumper:true,showSizeChanger:true}}
            loading={categorys.length === 0}
          />
          <Modal
              title="添加分类"
              visible={isShowAdd}
              onOk={this.addCategory}
              onCancel={() => this.setState({isShowAdd:false})}
          >
              <AddForm categorys={categorys} setForm={(form) => this.form = form} parentId={parentId}/>
          </Modal>

          <Modal
              title="修改分类"
              visible={isShowUpdate}
              onOk={this.updateCategory}
              onCancel={() => this.setState({isShowUpdate:false})}
          >
              <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>

          </Modal>
      </div>
    )
  }
}

//添加的form表单
class AddForm extends Component{

    static propTypes = {
        categorys:PropTypes.array.isRequired,
        setForm:PropTypes.func.isRequired,
        parentId:PropTypes.string.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {categorys,parentId} = this.props
        return(
            <Form>
                <Item label='所属分类'>
                    {getFieldDecorator('parentId',{initialValue:parentId})(
                        <Select>
                            <Option key='0' value='0'>一级分类</Option>
                            {categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                        </Select>
                    )}
                </Item>
                <Item label='分类名称'>
                    {getFieldDecorator('categoryName',{initialValue:''})(
                        <Input placeholder='请输入分类名称'/>
                    )}
                </Item>
            </Form>
        )
    }
}

AddForm = Form.create()(AddForm)

//修改的form表单
class UpdateForm extends Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired,
        categoryName:PropTypes.string
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {categoryName} = this.props
        return(
            <Form>
                <Item>
                    {getFieldDecorator('categoryName',{initialValue:categoryName})(
                        <Input placeholder='请输入分类名称'/>
                    )}
                </Item>
            </Form>
        )
    }
}

UpdateForm = Form.create()(UpdateForm)