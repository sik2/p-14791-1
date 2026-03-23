'use client'

import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  useEffect(() => {
    fetchUser()

    // 인증 상태(로그인/로그아웃) 변경을 감지하는 리스너
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event)
      setUser(session?.user ?? null)
    })

    // 클인업 함수 -> 컨포넌트가 언마운트 되거나 useEffect가 재실행되기 전
    // 이벤트 리스터 중복 호출 방지
    return () => data.subscription.unsubscribe()
  }, [])

  const handleOnLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    } else {
      alert('로그아웃 성공')
    }
  }

  return (
    <nav className="flex">
      <Link href="/" className="p-2 rounded hover:bg-gray-200">
        메인
      </Link>
      <Link href="/posts" className="p-2 rounded hover:bg-gray-200">
        글목록
      </Link>
      {user ? (
        <button
          onClick={handleOnLogout}
          className="p-2 rounded hover:bg-gray-200"
        >
          로그아웃
        </button>
      ) : (
        <>
          <Link href="/signup" className="p-2 rounded hover:bg-gray-200">
            회원가입
          </Link>
          <Link href="/signin" className="p-2 rounded hover:bg-gray-200">
            로그인
          </Link>
        </>
      )}
    </nav>
  )
}
