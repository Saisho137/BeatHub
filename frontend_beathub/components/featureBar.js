export default function FeatureBar({ name, value }) {
    value = Math.round(value * 100)

    return (
        <div className='col-md-3 mb-5'>
            <div className='card p-3 mb-2 theme theme-border'>
                <h5 className='heading text-capitalize'>{name}</h5>
                <div className='progress'>
                    <div
                        className={`progress-bar bg-${value >= 50 ? 'success' : value >= 25 ? 'warning' : 'danger'}`}
                        style={{ width: `${value}%` }}
                        role='progressbar'></div>
                </div>
                <div className='mt-2'> <span>{value}%</span> </div>
            </div>
        </div>
    )
}