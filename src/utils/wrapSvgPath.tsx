import { SvgIcon } from '@mui/material';

export const wrapSvgPath =
  (path: any, viewBox = '0 0 24 24') =>
  // eslint-disable-next-line react/display-name
  (props: any) =>
    (
      <SvgIcon {...props} viewBox={viewBox}>
        {path}
      </SvgIcon>
    );
