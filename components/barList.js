import Link from 'next/link'
import styles from '../styles/statistics.module.css'

// Ranked horizontal bars: [{ id, name, value, href }]
export default function BarList({ items, unit = 'songs' }) {
    if (!items || items.length === 0) return null

    const max = Math.max(...items.map(item => item.value))

    return (
        <ol className={styles.barList}>
            {items.map((item, index) => (
                <li key={item.id} className={styles.barRow}>
                    <span className={styles.barRank}>{index + 1}</span>
                    <div className={styles.barBody}>
                        <div className='d-flex justify-content-between gap-2'>
                            {item.href
                                ? <Link href={item.href} className={`theme text-truncate ${styles.barName}`}>{item.name}</Link>
                                : <span className={`text-truncate ${styles.barName}`}>{item.name}</span>}
                            <span className={styles.muted}>{item.value} {unit}</span>
                        </div>
                        <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ width: `${(item.value / max) * 100}%` }} />
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    )
}
