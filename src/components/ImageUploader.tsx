import React, { useState, ChangeEvent } from 'react';
import { Grid, Button } from '@mui/material';

type ImageUploaderProps = {
  onChange: (files: File[]) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    let selected: File[] = [];

    for (let i = 0; i < Math.min(files.length, 2); i++) {
      selected.push(files[i]);
    }

    setSelectedFiles(selected);

    if (onChange) {
      onChange(selected);
    }
  };

  const renderSelectedFiles = () => {
    return selectedFiles.map((file, index) => (
      <div key={index}>
        {file.name} ({formatBytes(file.size)})
      </div>
    ));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Grid item xs={12}>
      <input
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" fullWidth>
          Adicionar Foto(s)
        </Button>
      </label>
      {renderSelectedFiles()}
    </Grid>
  );
};

export default ImageUploader;
