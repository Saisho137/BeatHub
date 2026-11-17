import Link from 'next/link'

// Pill button back to the Explore page
export default function BackLink({ href = '/recommender', label = 'Search more' }) {
    return (
        <Link href={href} className='btn btn-soft d-inline-flex align-items-center gap-2'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                <path d='M15 18l-6-6 6-6' />
            </svg>
            {label}
        </Link>
    )
}
