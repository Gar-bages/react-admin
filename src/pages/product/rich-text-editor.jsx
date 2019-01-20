import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(), //创建一个空的编辑器
    }

    //传入detail 让编辑器把html标签转化成文本
    static propTypes = {
        detail:PropTypes.string
    }

    //得到输入的富文本内容
    getContent = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    //只要输入的文本改变就更新
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    //初始化框里内容
    componentWillMount() {
        const detail = this.props.detail
        //当有商品详情时  进行处理 把html标签转化成文本
        if(detail) {
            const blocksFromHtml = htmlToDraft(detail)
            const { contentBlocks, entityMap } = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
            const editorState = EditorState.createWithContent(contentState)
            this.state.editorState = editorState
        }

    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/*<textarea*/}
                    {/*disabled*/}
                    {/*value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
                {/*/>*/}
            </div>
        )
    }
}