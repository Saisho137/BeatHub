import styles from '../styles/statistics.module.css'

// Single-series column chart: how many of your top songs come from each decade
export default function DecadeChart({ decades, total }) {
    if (!decades || decades.length === 0) return null

    const max = Math.max(...decades.map(d => d.count))
    const peak = decades.find(d => d.count === max)
    const summary = decades.map(d => `${d.decade}s: ${d.count}`).join(', ')

    return (
        <figure className='mb-0'>
            <div className={styles.chart} role='img' aria-label={`Songs per decade. ${summary}`}>
                {decades.map(({ decade, count }) => (
                    <div key={decade} className={styles.column} tabIndex={0}>
                        <span className={styles.tooltip}>
                            {decade}s: {count} {count === 1 ? 'song' : 'songs'} ({Math.round(100 * count / total)}%)
                        </span>
                        {decade === peak.decade && <span className={styles.peakLabel}>{count}</span>}
                        <div className={styles.bar} style={{ height: `${(count / max) * 100}%` }} />
                    </div>
                ))}
            </div>
            <div className={styles.axis}>
                {decades.map(({ decade }) => <span key={decade}>{`'${String(decade).slice(2)}s`}</span>)}
            </div>
            <table className='visually-hidden'>
                <caption>Songs per decade</caption>
                <thead><tr><th>Decade</th><th>Songs</th></tr></thead>
                <tbody>
                    {decades.map(({ decade, count }) => <tr key={decade}><td>{decade}s</td><td>{count}</td></tr>)}
                </tbody>
            </table>
        </figure>
    )
}
