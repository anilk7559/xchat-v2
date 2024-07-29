import React, { forwardRef, useImperativeHandle } from 'react';

interface IProps {
  config: any;
  disabled: boolean;
  onFilesAdded: any;
  previewImage: string;
}

const Dropzone = forwardRef(({
  config,
  disabled,
  onFilesAdded,
  previewImage = '/images/baseline-cloud_upload-24px.svg'
}: IProps, parrentRef) => {
  const [hightlight, setHightlight] = React.useState(false);
  const fileInputRef = React.createRef() as any;

  const fileListToArray = (list: any) => {
    const array = [] as any;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const onChange = (evt: any) => {
    if (disabled) return;
    // TODO - check here for mime type
    const { files } = evt.target;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    if (disabled) return;
    setHightlight(true);
  };

  const onDragLeave = (event: any) => {
    event.preventDefault();
    setHightlight(false);
  };

  const onDrop = (event: any) => {
    event.preventDefault();
    if (disabled) return;
    const { files } = event.dataTransfer;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
    setHightlight(false);
  };

  const resetFileInput = () => {
    fileInputRef.current.value = '';
  };

  useImperativeHandle(parrentRef, () => ({
    resetFileInput
  }));

  React.useEffect(() => {
    if (config && !config.multiple) {
      fileInputRef.current.removeAttribute('multiple');
    }
  });

  return (
    <>
      <div
        className={`Dropzone ${hightlight ? 'Highlight' : ''}`}
        onDragOver={onDragOver.bind(this)}
        onDragLeave={onDragLeave.bind(this)}
        onDrop={onDrop.bind(this)}
        onClick={openFileDialog.bind(this)}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        <input
          ref={fileInputRef}
          className="FileInput"
          type="file"
          multiple
          accept={config.accept || '*/*'}
          onChange={onChange.bind(this)}
        />
        <img alt="upload" className="Icon" src={previewImage || 'default-avatar.png'} />
        <div className="IconCamera">
          <i className="fas fa-camera rounded-circle bg-primary p-2" />
        </div>
      </div>
      <div className="text-center mt-2">
        <span>Upload Files</span>
      </div>
    </>
  );
});

export default Dropzone;
