import React, { useState } from 'react';
import './ReactQuillEditor.style.scss';
import ReactQuill from 'react-quill';


const ReactQuillEditor = ({ defaultValue, id, modules, formats, onChange, readOnly, onBlur }) => {

    const [Value, setValue] = useState(defaultValue || "");

    const handleBlur = (previousRange, source, editor) => {
        console.log({ previousRange, source, editor })
        if (onBlur) onBlur(Value, id)
    }

    const handleChange = (content, delta, source, editor) => {
        setValue(content);
        if (onChange) onChange(Value)
    }


    return (
        <ReactQuill
            id="3232"
            theme="bubble"
            value={Value}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            onChange={handleChange}
            onBlur={handleBlur} />
    );
}

export default ReactQuillEditor;
