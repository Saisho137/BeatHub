import styles from '../styles/statistics.module.css'

export default function StatTile({ label, value, detail }) {
    return (
        <div className='col-6 col-md-4 col-xl-2 mb-3'>
            <div className={`card h-100 text-center p-3 theme theme-border ${styles.tile}`}>
                <p className={`mb-1 ${styles.tileValue}`}>{value}</p>
                <p className='mb-0 fw-semibold'>{label}</p>
                {detail && <p className={`mb-0 small ${styles.muted}`}>{detail}</p>}
            </div>
        </div>
    )
}
