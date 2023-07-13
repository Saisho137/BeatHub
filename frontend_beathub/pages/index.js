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
        } else if (buttonType === 'game') {
          router.push('/game')
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
      <div className={`container-fluid text-center m-0 p-0 ${indexStyles.bgTest}`}>
        <div className='row text-center mt-5 ms-5'>
          <div className='col-md-6 p-0'>
            <h1 className='fs-1 mt-5 me-md-5 pe-5'>Dive into a world of music</h1>
            <h3 className='text-start mx-lg-5 px-lg-5 d-none d-md-block'>Find new music, test your knowledge and learn about yourself with an all-in-one music tool.</h3>
            <div className='row mt-5 p-3 pe-sm-none'>
              <ToastContainer />
              <div className='col-12 d-flex justify-content-center'>
                <button className={`theme theme-border mx-2 py-3 ${indexStyles.button28} mr-auto ml-auto`} onClick={() => handleClick('game')}>Play</button>
                <button className={`theme theme-border mx-3 mx-md-5 py-3 ${indexStyles.button28} mr-auto ml-auto`} onClick={() => handleClick('recommender')}>Discover</button>
              </div>
            </div>
          </div>
          <div className="col-md-6" style={{ marginBottom: '50px' }}>
            <img src='/images/cat-music.png' className={`img-fluid ${indexStyles.homeImage}`} style={{position: 'relative', zIndex:'1'}} alt='cat with headphones' />
          </div>
        </div>
      </div>
    </Layout>
  )
}