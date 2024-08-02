import React, { useState, useEffect } from 'react';

function KakaoUser() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedProfile = window.localStorage.getItem("profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>사용자 프로필</h1>
      <p>이름: {profile.nickname}</p>
      <p>이메일: {profile.email}</p>
      {/* 추가적인 프로필 정보를 여기에 표시할 수 있습니다 */}
    </div>
  );
}

export default KakaoUser;