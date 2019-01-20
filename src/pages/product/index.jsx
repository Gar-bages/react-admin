import React, {Component} from 'react'
import {Card,Select,Input,Button,Icon,Table} from 'antd'
import {reqProducts,reqSearchProducts} from '../../api/index'

const Option = Select.Option
export default class ProductIndex extends Component {

    state = {
        total:0,
        products:[],//当前列表数据 => list
        searchType:'productName',  //productName productDesc (搜索类型)
        searchName:''
    }

    getProducts = async (pageNum) => {
        const {searchType,searchName} = this.state
        let result
        if(searchName) { //搜索分页
            result = await reqSearchProducts({pageNum,pageSize: 6,searchType,searchName})
        }else { //一般分页
            result = await reqProducts(pageNum,6) //pageSize = 2 一页显示2个
        }

        if(result.status === 0) {
            const {total,list} = result.data  //知道总数量才可以知道显示几页
            this.setState({
                total,
                products:list
            })
        }
    }

    componentWillMount() {
        this.columns = [{
            title: '商品名称',
            dataIndex: 'name',
        }, {
            title: '商品描述',
            dataIndex: 'desc'
        },{
            title: '价格',
            dataIndex: 'price',
            render:(price) => <span>￥{price}</span>
        },{
            title: '状态',
            dataIndex: 'status',
            render:(status) => (
                <span>
                    <Button type='primary'>下架</Button>
                    &nbsp;&nbsp;
                    <span>在售</span>
                </span>
            )
        },{
            title: '操作',
            render:(product) => (
                <span>
                    <a href='javascript:'>详情</a>
                    &nbsp; &nbsp; &nbsp;
                    <a href='javascript:' onClick={() => this.props.history.push('/product/saveupdate',product)}>修改</a>
                </span>
            )
        }
        ];
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const columns = this.columns
        const {products,total,searchType} = this.state
        //Select中onChange =>  选中Option 或 input 的value变化时执行回调
        return (
            <div>
                <Card>
                    <Select value={searchType} onChange={(value) => this.setState({searchType:value}) }>
                        <Option key='productName' value='productName'>根据名称搜索</Option>
                        <Option key='productDesc' value='productDesc'>根据描述搜索</Option>
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    <Input placeholder='关键字' style={{width:160}}
                           onChange ={(e) => this.setState({searchName:e.target.value})}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
                    <Button type='primary' style={{float:'right'}} onClick={() => this.props.history.push('/product/saveupdate')}>
                        <Icon type='plus'/>
                        添加产品
                    </Button>
                </Card>
                <Table
                    columns={columns}
                    bordered
                    dataSource={products}
                    rowKey='_id' //表格行 key 的取值，可以是字符串或一个函数
                    pagination={{
                        total,
                        defaultPageSize:6, //默认每页显示几个数据
                        showQuickJumper:true, //是否可以快速跳转至某页
                        // showSizeChanger:true, 是否可以改变 pageSize
                        onChange:this.getProducts //页码改变的回调
                    }}
                />
            </div>
        )
    }
}