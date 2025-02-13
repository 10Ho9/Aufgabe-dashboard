import { useState, useEffect } from "react";

function BackendCheck() {
  const [backendStatus, setBackendStatus] = useState("연결 확인 중...");

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/api/backend-check`
        );
        if (response.ok) {
          setBackendStatus("백엔드 연결 정상");
        } else {
          setBackendStatus(`백엔드 연결 실패: 상태 코드 ${response.status}`);
        }
      } catch (error) {
        setBackendStatus(`백엔드 연결 에러: ${error.message}`);
      }
    };

    checkBackendConnection();
  }, []);
  return (
    <div>
      <h2>백엔드 연결 상태 확인</h2>
      <p>상태: {backendStatus}</p>
    </div>
  );
}

export default BackendCheck;
