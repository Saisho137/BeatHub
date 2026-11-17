import React, { useEffect } from 'react'
import Layout from "../components/layout"
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import indexStyles from "../styles/index.module.css"
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (typeof sessionStorage !== 'undefined') {
        const tokenTimestamp = sessionStorage.getItem('tokenTimestamp')
        if (tokenTimestamp) {
          const currentTimestamp = Date.now()
          const elapsedMilliseconds = currentTimestamp - tokenTimestamp
          const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60)

          if (elapsedHours >= 1) {
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('tokenTimestamp')
            alert('Your session has expired. Please login again.')
          }
        }
      }
    }

    checkTokenExpiration()
  }, [])

  const handleClick = (buttonType) => {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('token')
      if (token) {
        if (buttonType === 'recommender') {
          router.push('/recommender')
        } else if (buttonType === 'statistics') {
          router.push('/statistics')
        }
      } else {
        toast.warning('You are not logged in. Please login to access this functionality.', {
          autoClose: 1500,
          position: toast.POSITION.TOP_CENTER,
          closeButton: true,
          className: 'custom-toast',
        })
      }
    }
  }

  return (
    <Layout>
      <div className={`container-fluid m-0 px-0 pt-0 ${indexStyles.hero}`}>
        <div className='container py-5'>
          <div className='row align-items-center gy-4 pt-lg-4'>
            <div className='col-md-6 text-center text-md-start'>
              <p className='text-muted small text-uppercase fw-semibold mb-2'>Spotify statistics</p>
              <h1 className='display-4 mb-3' style={{ fontWeight: 900 }}>Your Spotify, in numbers</h1>
              <p className='fs-5 text-muted mb-4'>Discover your top songs and artists, how your taste changes over time and which decades you really listen to.</p>
              <ToastContainer />
              <div className='d-flex flex-wrap gap-3 justify-content-center justify-content-md-start'>
                <button className='btn main-color btn-lg' onClick={() => handleClick('statistics')}>My Stats</button>
                <button className='btn btn-soft btn-lg' onClick={() => handleClick('recommender')}>Explore</button>
              </div>
            </div>
            <div className='col-md-6 text-center'>
              <img src='/images/cat-music.png' className={`img-fluid ${indexStyles.homeImage}`} alt='cat with headphones' />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
