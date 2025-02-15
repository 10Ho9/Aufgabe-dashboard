// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import logoPng from 'assets/images/logo.png'; // PNG 파일 경로 (추가)

// ==============================|| LOGO ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <img
      src={logoPng} // PNG 파일 사용
      alt="Your Company Logo" //  alt 텍스트 수정
      width="92" // 필요에 따라 너비 조정
      height="32" // 필요에 따라 높이 조정
    />
  );
}
