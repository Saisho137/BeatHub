export default function FeatureBar({name, value}) {
    value = Math.round(value * 100)

    return (
        <div className='col-md-3'>
            <div className='card p-3 mb-2'>
                <div className='mt-5'>
                    <h3 className='heading'>{name}</h3>
                    <div className='mt-5'>
                        <div className='progress'>
                            <div className='progress-bar bg-success' style={{ width: `${value}%` }} role='progressbar'></div>
                        </div>
                        <div className='mt-3'> <span className='text1'>{value}</span> </div>
                    </div>
                </div>
            </div>
        </div>
    )
}