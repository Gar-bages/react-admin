import React, {Component} from 'react'
import { Upload, Icon, Modal,message} from 'antd'
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api'

//照片  添加商品的时候肯定没有图片  编辑的时候商品有图片 必然要显示图片
//所以产品的图片信息通过父组件传过来
export default class PicturesWall extends Component {
    static propTypes = {
        imgs:PropTypes.array
    }

    state = {
        previewVisible: false, // 是否显示大图预览
        previewImage: '',  //大图的url
        fileList: [],  // 所有需要显示的图片信息对象的数组
    };

    //得到当前已上传的图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    //点击取消或图片之外的部分 预览大图隐藏
    handleCancel = () => this.setState({ previewVisible: false })

    //点击预览触发回调
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl, //没有上传成功浏览器会通过file.thumbUrl（base64图片地址）显示图片
            previewVisible: true,
        });
    }

    //文件状态改变的回调（根据图片状态显示进度条）
    //file: 当前操作文件信息对象
    //fileList: 所有文件信息对象的数组
    handleChange = async ({ file,fileList }) => {
        console.log('handleChange', file,fileList);
        if(file.status === 'done') {
            const result = file.response
            if(result.status === 0) {
                message.success('上传成功')
                const {name,url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            }else {
                message.error('上传失败')
            }
        }else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if(result.status === 0) {
                message.success('删除成功')
            }else {
                message.error('删除失败')
            }
        }

        this.setState({ fileList })
    }

    componentWillMount() {
        const imgs = this.props.imgs
        if(imgs && imgs.length>0) {
            //通过遍历图片 生成对应的fileList 并更新fileList状态
            const fileList = imgs.map((img,index) => ({
                uid: -index, //文件表示 负值为了防止与内部id冲突
                name: img,
                status: 'done', //loading 上传中  done 上传完成  remove 删除
                url: 'http://localhost:5000/upload/'+ img,
            })
            )
            this.state.fileList = fileList
        }

    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload" //上传到哪
                    accept='image/*' //只能看到所有的image文件
                    name='image' // 发到后台的文件参数名 
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>

                {/*大图预览*/}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}