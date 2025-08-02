'use client'
import UserDetail from '@/components/userDetail/UserDetail'
import { useParams } from 'next/navigation'
import React from 'react'

export default function ChiTietNhanVien() {
  const {userCode} = useParams()
  
  // Force component to re-render with fresh data when userCode changes
  const keyProp = Array.isArray(userCode) ? userCode[0] : userCode;
  
  return (
    <div>
      <UserDetail key={`user-detail-${keyProp}-${Date.now()}`} userCode={userCode}/>
    </div>
  )
}
