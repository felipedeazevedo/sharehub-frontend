import React, { useState, ChangeEvent, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';

type ImageUploaderProps = {
  onChange: (files: File[]) => void;
  initialImages?: File[];
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, initialImages = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialImages.length > 0) {
      setSelectedFiles(initialImages);
      onChange(initialImages);
    }
  }, [initialImages, onChange]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    let selected: File[] = [];

    for (let i = 0; i < Math.min(files.length, 2); i++) {
      console.log('ENTREIIII')
      selected.push(files[i]);
    }

    console.log('SELECTED', selected)
    if (selected.length === 0) {
      setError('Pelo menos uma imagem deve ser selecionada.');
    } else {
      setError('');
      setSelectedFiles(selected);
      onChange(selected);
    }
  };

		
  const renderSelectedFiles = () => {
    return selectedFiles.map((file, index) => (
      <div key={index} style={{ margin: '10px 0' }}>
        <img
          src={URL.createObjectURL(file)}
          alt={`preview ${index}`}
          style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
        />
        <span>{file.name} ({formatBytes(file.size)})</span>
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
      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
          {error}
        </Typography>
      )}
      {renderSelectedFiles()}
    </Grid>
  );
};

export default ImageUploader;
