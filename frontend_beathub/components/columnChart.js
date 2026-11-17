import styles from '../styles/statistics.module.css'

// Single-series column chart.
// data: [{ key, label, value, tooltip }]; the peak column gets a direct value label.
export default function ColumnChart({ data, title, valueName = 'songs' }) {
    if (!data || data.length === 0) return null

    const max = Math.max(...data.map(d => d.value))
    const peakKey = max > 0 ? data.find(d => d.value === max).key : null
    const summary = data.map(d => `${d.label}: ${d.value}`).join(', ')
    // Thin out axis labels when there are many columns (e.g. 24 hours)
    const labelStep = data.length > 12 ? Math.ceil(data.length / 8) : 1

    return (
        <figure className='mb-0'>
            <div className={styles.chart} role='img' aria-label={`${title}. ${summary}`}>
                {data.map(({ key, value, tooltip }) => (
                    <div key={key} className={styles.column} tabIndex={0}>
                        <span className={styles.tooltip}>{tooltip}</span>
                        {key === peakKey && <span className={styles.peakLabel}>{value}</span>}
                        <div className={styles.bar} style={{ height: max > 0 ? `${(value / max) * 100}%` : 0 }} />
                    </div>
                ))}
            </div>
            <div className={styles.axis}>
                {data.map(({ key, label }, index) => <span key={key}>{index % labelStep === 0 ? label : ''}</span>)}
            </div>
            <table className='visually-hidden'>
                <caption>{title}</caption>
                <thead><tr><th>Group</th><th>{valueName}</th></tr></thead>
                <tbody>
                    {data.map(({ key, label, value }) => <tr key={key}><td>{label}</td><td>{value}</td></tr>)}
                </tbody>
            </table>
        </figure>
    )
}
