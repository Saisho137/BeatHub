import Layout from './layout'

export default function PageLoader({ label = 'Loading' }) {
    return (
        <Layout>
            <div className='d-flex justify-content-center align-items-center' style={{ height: '30em' }}>
                <div className='spinner-border' role='status' style={{ width: '3rem', height: '3rem', color: 'var(--brand)' }}>
                    <span className='visually-hidden'>{label}</span>
                </div>
            </div>
        </Layout>
    )
}
