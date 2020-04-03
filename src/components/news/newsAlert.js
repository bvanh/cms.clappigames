import { Modal } from 'antd'


function alertError() {
    Modal.error({
        title: 'Something went wrong!',
        content: 'Check again post title, subtile, status and post content !',
    });
}

export {alertError};