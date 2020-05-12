import { Modal } from 'antd'
function alertErrorServer(contentError) {
    Modal.error({
        title: 'Something went wrong!',
        content: contentError,
    });
}

export {alertErrorServer}