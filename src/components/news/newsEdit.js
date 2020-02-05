import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

class NewsEditor extends Component {
  render() {
    return (
        <CKEditor
        onInit={ editor => {
            console.log( 'Editor is ready to use!', editor );

            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        } }
        onChange={ ( event, editor ) => console.log( { event, editor } ) }
        editor={ DecoupledEditor }
        data="<p>Hello from CKEditor 5's DecoupledEditor!</p>"
        // config={ /* the editor configuration */ }
    />
    );
  }
}

export default NewsEditor;
