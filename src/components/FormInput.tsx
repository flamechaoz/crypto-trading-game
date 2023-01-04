import { FormHelperText, Typography, FormControl, OutlinedInput as Input, InputProps } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
  name: string;
  label: string;
} & InputProps;

const FormInput: FC<IFormInputProps> = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {label}
          </Typography>
          <Input
            {...field}
            fullWidth
            disableUnderline
            sx={{ borderRadius: '1rem' }}
            error={!(errors[name] == null)}
            {...otherProps}
            color="primary"
          />
          <FormHelperText error={!(errors[name] == null)}>{errors[name] != null ? errors[name].message : ''}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormInput;
