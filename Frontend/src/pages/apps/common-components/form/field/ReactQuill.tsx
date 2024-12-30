import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
// third-party
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// ==============================|| EDITOR - QUILL ||============================== //

const ReactQuillDemo = ({ field, formik }: { field: string; formik: any }) => {
  const [text, setText] = useState(formik.values[field] || '');
  const prevFieldValue = useRef(formik.values[field]);

  useEffect(() => {
    if (prevFieldValue.current !== formik.values[field]) {
      setText(formik.values[field]);
      prevFieldValue.current = formik.values[field];
    }
    //eslint-disable-next-line
  }, [formik.values[field]]);

  const handleChange = (value: string) => {
    const cleanHTML = DOMPurify.sanitize(value);
    setText(cleanHTML);
    formik.setFieldValue(field, cleanHTML);
  };

  return <ReactQuill value={text} onChange={handleChange} />;
};

export default ReactQuillDemo;
